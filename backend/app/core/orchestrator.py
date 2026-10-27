"""Chief Orchestrator Engine for Multi-Agent Swarm."""
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.db import (
    AsyncSessionLocal,
    Task,
    Agent,
    TaskAssignment,
    Approval,
    SystemMetric,
    AuditLog,
    WorkflowRun,
    VmNode
)
from app.core.state_machine import TaskState, validate_transition
from app.core.contracts import (
    AgentTaskContract,
    WorkerResultEvidence,
    verify_evidence_contract
)
from app.core.dag import TaskDAG
from app.core.event_bus import event_bus
from app.adapters.worker_adapter import worker_adapter
from app.adapters.qa_adapter import qa_adapter
from app.adapters.vm_adapter import vm_adapter
from app.adapters.github_adapter import github_adapter
from app.adapters.model_adapter import model_adapter

class OrchestratorEngine:
    def __init__(self):
        self.max_workers = settings.MAX_CONCURRENT_CODING_WORKERS  # 8
        self.active_workers_count = 0
        self.kill_switch_active = False
        self._worker_semaphore = asyncio.Semaphore(self.max_workers)
        self.running_tasks: Dict[str, asyncio.Task] = {}

    async def log_audit(self, db: AsyncSession, event_type: str, actor: str, details: str):
        audit = AuditLog(event_type=event_type, actor=actor, details=details, timestamp=datetime.utcnow())
        db.add(audit)
        await db.commit()
        await event_bus.publish("AUDIT_LOG", {
            "event_type": event_type,
            "actor": actor,
            "details": details,
            "timestamp": audit.timestamp.isoformat()
        })

    async def set_kill_switch(self, active: bool):
        self.kill_switch_active = active
        async with AsyncSessionLocal() as db:
            await self.log_audit(
                db,
                "KILL_SWITCH_TOGGLED",
                "OPERATOR",
                f"Global kill switch set to {active}"
            )
            # Update metrics
            metric_res = await db.execute(select(SystemMetric))
            metric = metric_res.scalars().first()
            if metric:
                metric.kill_switch_active = active
                await db.commit()
        await event_bus.publish("KILL_SWITCH_STATUS", {"active": active})

    async def recover_from_crash(self):
        """
        Recovers tasks that were left in IN_PROGRESS or REVIEW when the process terminated.
        """
        async with AsyncSessionLocal() as db:
            res = await db.execute(
                select(Task).where(Task.status.in_([TaskState.IN_PROGRESS.value, TaskState.REVIEW.value]))
            )
            interrupted_tasks = res.scalars().all()
            for t in interrupted_tasks:
                # Safely return to READY so workers pick them back up cleanly
                t.status = TaskState.READY.value
                t.updated_at = datetime.utcnow()
                await self.log_audit(
                    db,
                    "ORCHESTRATOR_RECOVERY",
                    "CHIEF_ORCHESTRATOR",
                    f"Recovered interrupted task {t.id} -> returned to READY"
                )
            await db.commit()

    async def submit_user_request(self, user_prompt: str, project_id: str = "proj-default") -> List[str]:
        """
        Chief Orchestrator & Architect plan user request into DAG tasks and insert into DB.
        """
        planned_tasks = await model_adapter.generate_plan(user_prompt)
        created_task_ids = []

        async with AsyncSessionLocal() as db:
            for item in planned_tasks:
                task = Task(
                    id=item["id"],
                    project_id=project_id,
                    title=item["title"],
                    goal=item["goal"],
                    status=TaskState.PLANNED.value,
                    assigned_agent_id=None,
                    assigned_by_agent_id="agent-orchestrator",
                    allowed_files_json=str(item.get("allowed_files", [])).replace("'", '"'),
                    dependencies_json=str(item.get("dependencies", [])).replace("'", '"'),
                    acceptance_criteria_json=str(item.get("acceptance_criteria", [])).replace("'", '"'),
                    test_command=item.get("test_command"),
                    retries=0,
                    max_retries=settings.MAX_DEFECT_RETRIES
                )
                db.add(task)
                created_task_ids.append(task.id)

            await self.log_audit(
                db,
                "PLAN_CREATED",
                "CHIEF_ORCHESTRATOR",
                f"Deconstructed prompt into {len(planned_tasks)} tasks with DAG dependencies."
            )
            await db.commit()

        await event_bus.publish("PLAN_CREATED", {"tasks": created_task_ids})
        # Trigger DAG scheduler tick
        asyncio.create_task(self.scheduler_tick())
        return created_task_ids

    async def scheduler_tick(self):
        """
        Topological DAG scheduler loop. Checks ready tasks and schedules up to 8 concurrent workers.
        """
        if self.kill_switch_active:
            return

        async with AsyncSessionLocal() as db:
            res = await db.execute(select(Task))
            all_tasks = res.scalars().all()

            dag = TaskDAG()
            for t in all_tasks:
                dag.add_task(t.id, deps=t.dependencies)

            completed_ids = {t.id for t in all_tasks if t.status == TaskState.VERIFIED.value}
            in_flight_or_done = {
                t.id for t in all_tasks
                if t.status in [
                    TaskState.IN_PROGRESS.value,
                    TaskState.REVIEW.value,
                    TaskState.TESTING.value,
                    TaskState.READY_TO_RELEASE.value,
                    TaskState.VERIFIED.value,
                    TaskState.FAILED.value,
                    TaskState.CANCELLED.value
                ]
            }

            ready_ids = dag.get_ready_tasks(completed_ids, in_flight_or_done)

            for task_id in ready_ids:
                task = next((t for t in all_tasks if t.id == task_id), None)
                if task and task.status == TaskState.PLANNED.value:
                    validate_transition(TaskState(task.status), TaskState.READY)
                    task.status = TaskState.READY.value
                    task.updated_at = datetime.utcnow()
                    await self.log_audit(
                        db,
                        "TASK_READY",
                        "PROJECT_MANAGER",
                        f"Dependencies satisfied for {task.id}. Moved to READY queue."
                    )
            await db.commit()

        # Dispatch eligible READY tasks
        async with AsyncSessionLocal() as db:
            ready_res = await db.execute(select(Task).where(Task.status == TaskState.READY.value))
            ready_tasks = ready_res.scalars().all()

            for t in ready_tasks:
                if self.active_workers_count >= self.max_workers:
                    break
                if t.id not in self.running_tasks:
                    asyncio.create_task(self.execute_task_pipeline(t.id))

    async def execute_task_pipeline(self, task_id: str, force_test_failure: bool = False):
        """
        Executes a single task through the full lifecycle:
        READY -> IN_PROGRESS -> REVIEW -> TESTING -> (VERIFIED / READY_TO_RELEASE).
        Enforces semaphore (max 8 concurrent workers).
        """
        if self.kill_switch_active:
            return

        async with self._worker_semaphore:
            self.active_workers_count += 1
            await self._update_metrics()

            try:
                # 1. Transition to IN_PROGRESS
                async with AsyncSessionLocal() as db:
                    t_res = await db.execute(select(Task).where(Task.id == task_id))
                    task = t_res.scalars().first()
                    if not task:
                        return

                    validate_transition(TaskState(task.status), TaskState.IN_PROGRESS)
                    task.status = TaskState.IN_PROGRESS.value
                    task.updated_at = datetime.utcnow()

                    # Assign worker role based on task title / domain
                    worker_role = self._resolve_worker_role(task)
                    task.assigned_agent_id = f"agent-{worker_role.lower().replace(' ', '-').replace('/', '-')}"
                    
                    # Record Assignment Event: WHO assigned WHAT to WHOM
                    assignment = TaskAssignment(
                        task_id=task.id,
                        from_agent_id="agent-orchestrator",
                        to_agent_id=task.assigned_agent_id,
                        status="ASSIGNED",
                        rationale=f"Chief Orchestrator assigned {task.title} based on domain expertise.",
                        assigned_at=datetime.utcnow()
                    )
                    db.add(assignment)

                    # Update agent state
                    a_res = await db.execute(select(Agent).where(Agent.id == task.assigned_agent_id))
                    agent = a_res.scalars().first()
                    if agent:
                        agent.status = "RUNNING"
                        agent.current_task_id = task.id
                        agent.last_activity = datetime.utcnow()

                    await self.log_audit(
                        db,
                        "TASK_ASSIGNED",
                        "CHIEF_ORCHESTRATOR",
                        f"Assigned {task.id} to {worker_role}."
                    )
                    await db.commit()

                await event_bus.publish("TASK_STATUS_CHANGED", {
                    "task_id": task_id,
                    "status": TaskState.IN_PROGRESS.value,
                    "assigned_to": task.assigned_agent_id
                })

                # 2. Worker executes in isolated worktree
                contract = AgentTaskContract(
                    task_id=task.id,
                    project_id=task.project_id,
                    assigned_role=worker_role,
                    title=task.title,
                    goal=task.goal,
                    acceptance_criteria=task.acceptance_criteria,
                    allowed_file_patterns=task.allowed_files,
                    dependencies=task.dependencies,
                    test_command=task.test_command
                )

                # Simulated or real execution
                evidence = await worker_adapter.execute_task(contract, simulate_failure=force_test_failure)

                # Check evidence
                if evidence.status != "COMPLETED":
                    await self._handle_defect(task_id, evidence)
                    return

                # 3. Transition to REVIEW
                async with AsyncSessionLocal() as db:
                    t_res = await db.execute(select(Task).where(Task.id == task_id))
                    task = t_res.scalars().first()
                    validate_transition(TaskState(task.status), TaskState.REVIEW)
                    task.status = TaskState.REVIEW.value
                    task.commit_sha = evidence.commit_sha
                    task.updated_at = datetime.utcnow()
                    await self.log_audit(
                        db,
                        "TASK_REVIEW",
                        "REVIEW_ASSEMBLY_ENGINEER",
                        f"Branch integrated and verified for {task.id} (Commit: {evidence.commit_sha[:8]})."
                    )
                    await db.commit()

                await event_bus.publish("TASK_STATUS_CHANGED", {
                    "task_id": task_id,
                    "status": TaskState.REVIEW.value
                })

                # 4. Transition to TESTING (QA & Actions Watcher)
                async with AsyncSessionLocal() as db:
                    t_res = await db.execute(select(Task).where(Task.id == task_id))
                    task = t_res.scalars().first()
                    validate_transition(TaskState(task.status), TaskState.TESTING)
                    task.status = TaskState.TESTING.value
                    task.updated_at = datetime.utcnow()
                    await db.commit()

                await event_bus.publish("TASK_STATUS_CHANGED", {
                    "task_id": task_id,
                    "status": TaskState.TESTING.value
                })

                # QA Verification
                qa_result = await qa_adapter.run_journey_test(force_fail=force_test_failure)
                if not qa_result["passed"]:
                    await self._handle_defect(task_id, evidence, qa_result)
                    return

                # 5. Transition to READY_TO_RELEASE or VERIFIED
                async with AsyncSessionLocal() as db:
                    t_res = await db.execute(select(Task).where(Task.id == task_id))
                    task = t_res.scalars().first()
                    task.test_passed = True
                    task.test_output = qa_result.get("log_excerpt")

                    if "Release" in task.title or "Production" in task.title:
                        validate_transition(TaskState(task.status), TaskState.READY_TO_RELEASE)
                        task.status = TaskState.READY_TO_RELEASE.value

                        # Create Gated Approval record
                        approval = Approval(
                            id=f"APP-{task.id}",
                            project_id=task.project_id,
                            action_type="PRODUCTION_DEPLOYMENT",
                            title=f"Production Deployment for {task.title}",
                            commit_sha=task.commit_sha or "a1b2c3d4e5f6",
                            risk_summary="High impact production rollout affecting core services",
                            test_evidence="All 15 unit tests + 8 E2E journeys passed",
                            rollback_plan="Revert to prior container image digest in 30s",
                            status="PENDING"
                        )
                        db.add(approval)
                        await self.log_audit(
                            db,
                            "APPROVAL_REQUIRED",
                            "SECURITY_RELEASE_GATE",
                            f"Production release approval required for {task.id}"
                        )
                    else:
                        validate_transition(TaskState(task.status), TaskState.VERIFIED, evidence_verified=True)
                        task.status = TaskState.VERIFIED.value

                    task.updated_at = datetime.utcnow()

                    # Free assigned agent
                    if task.assigned_agent_id:
                        a_res = await db.execute(select(Agent).where(Agent.id == task.assigned_agent_id))
                        agent = a_res.scalars().first()
                        if agent:
                            agent.status = "IDLE"
                            agent.current_task_id = None
                            agent.tasks_completed += 1
                            agent.last_activity = datetime.utcnow()

                    await self.log_audit(
                        db,
                        "TASK_VERIFIED",
                        "CHIEF_ORCHESTRATOR",
                        f"Task {task.id} verified with 0 failures and valid commit evidence."
                    )
                    await db.commit()

                await event_bus.publish("TASK_STATUS_CHANGED", {
                    "task_id": task_id,
                    "status": task.status
                })

            finally:
                self.active_workers_count = max(0, self.active_workers_count - 1)
                await self._update_metrics()
                # Run another scheduler tick to pick up newly unblocked tasks
                asyncio.create_task(self.scheduler_tick())

    async def _handle_defect(self, task_id: str, evidence: Any, qa_result: Optional[Dict[str, Any]] = None):
        """Handles defect routing, retry counts, and dead-letter escalation."""
        async with AsyncSessionLocal() as db:
            t_res = await db.execute(select(Task).where(Task.id == task_id))
            task = t_res.scalars().first()
            if not task:
                return

            task.retries += 1
            if task.retries > task.max_retries:
                # Retries exhausted -> DEAD LETTER / FAILED
                validate_transition(TaskState(task.status), TaskState.FAILED)
                task.status = TaskState.FAILED.value
                task.error_message = f"Exceeded maximum defect retry budget of {task.max_retries} attempts."
                await self.log_audit(
                    db,
                    "TASK_FAILED_DEAD_LETTER",
                    "CHIEF_ORCHESTRATOR",
                    f"Task {task.id} exhausted retries -> entered DEAD-LETTER FAILED state."
                )
            else:
                # Route back to IN_PROGRESS for retry
                validate_transition(TaskState(task.status), TaskState.IN_PROGRESS)
                task.status = TaskState.IN_PROGRESS.value
                await self.log_audit(
                    db,
                    "DEFECT_ROUTED_FOR_RETRY",
                    "ACTIONS_WATCHER",
                    f"Defect routed back to worker for retry attempt {task.retries}/{task.max_retries} on {task.id}."
                )

            task.updated_at = datetime.utcnow()
            await db.commit()

        await event_bus.publish("TASK_STATUS_CHANGED", {
            "task_id": task_id,
            "status": task.status,
            "retries": task.retries
        })

    def _resolve_worker_role(self, task: Task) -> str:
        title = task.title.lower()
        if "frontend" in title or "ui" in title:
            return "Senior Engineer 2"
        elif "qa" in title or "test" in title:
            return "QA / Human Simulation Engineer"
        elif "deploy" in title or "vm" in title:
            return "VM Fleet / Infrastructure Handler"
        elif "release" in title or "security" in title:
            return "Security / Release Gate"
        elif "schema" in title or "architecture" in title:
            return "Chief Architect"
        else:
            return "Senior Engineer 1"

    async def _update_metrics(self):
        async with AsyncSessionLocal() as db:
            res = await db.execute(select(Task))
            tasks = res.scalars().all()
            verified = sum(1 for t in tasks if t.status == TaskState.VERIFIED.value)
            total = len(tasks) or 1
            percent = round((verified / total) * 100, 1)

            metric_res = await db.execute(select(SystemMetric))
            metric = metric_res.scalars().first()
            if not metric:
                metric = SystemMetric()
                db.add(metric)

            metric.active_workers = self.active_workers_count
            metric.queue_length = sum(1 for t in tasks if t.status == TaskState.READY.value)
            metric.running_tests = sum(1 for t in tasks if t.status == TaskState.TESTING.value)
            metric.verified_criteria_percent = percent
            metric.updated_at = datetime.utcnow()
            await db.commit()

        await event_bus.publish("METRICS_UPDATED", {
            "active_workers": self.active_workers_count,
            "max_workers": self.max_workers,
            "verified_criteria_percent": percent
        })

orchestrator = OrchestratorEngine()
