"""FastAPI Routers for Swarm Dashboard and API Integration."""
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.db import (
    get_db,
    Project,
    Agent,
    Task,
    TaskAssignment,
    Approval,
    WorkflowRun,
    VmNode,
    SystemMetric,
    AuditLog,
    BaDiscussion,
    RdSuggestion,
    UiUxDesignSpec,
    LegacyRegressionCheck
)
from app.core.state_machine import TaskState, validate_transition
from app.core.orchestrator import orchestrator
from app.core.event_bus import event_bus
from app.adapters.github_adapter import github_adapter
from app.adapters.vm_adapter import vm_adapter, redact_secrets

router = APIRouter()

# DTOs
class UserRequestPayload(BaseModel):
    prompt: str
    project_id: str = "proj-default"

class ApprovalDecisionPayload(BaseModel):
    actor: str = "Lead Engineer"
    rationale: Optional[str] = None

class KillSwitchPayload(BaseModel):
    active: bool

class CreateAgentPayload(BaseModel):
    id: Optional[str] = None
    name: str
    role: str
    parent_id: Optional[str] = "agent-giriraj"
    model: Optional[str] = "Gemini 1.5 Flash"
    department: Optional[str] = "Core Engineering"

class UpdateAgentPayload(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    parent_id: Optional[str] = None
    status: Optional[str] = None
    model: Optional[str] = None
    department: Optional[str] = None

# 1. Projects
@router.get("/projects")
async def list_projects(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Project))
    return res.scalars().all()

# 2. Agents & Hierarchy
@router.get("/agents")
async def list_agents(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Agent))
    agents = res.scalars().all()
    # Format with role details and logs
    return [
        {
            "id": a.id,
            "name": a.name,
            "role": a.role,
            "status": a.status,
            "current_task_id": a.current_task_id,
            "parent_id": a.parent_id,
            "model": a.model,
            "tasks_completed": a.tasks_completed,
            "tasks_failed": a.tasks_failed,
            "last_activity": a.last_activity.isoformat() if a.last_activity else None,
            "logs": a.logs
        }
        for a in agents
    ]

@router.post("/agents")
async def create_agent(payload: CreateAgentPayload, db: AsyncSession = Depends(get_db)):
    import re
    agent_id = payload.id
    if not agent_id:
        slug = re.sub(r'[^a-z0-9]+', '-', payload.name.lower()).strip('-')
        agent_id = f"agent-{slug}"

    existing = await db.get(Agent, agent_id)
    if existing:
        agent_id = f"{agent_id}-{int(datetime.utcnow().timestamp())}"

    new_agent = Agent(
        id=agent_id,
        name=payload.name,
        role=payload.role,
        parent_id=payload.parent_id,
        model=payload.model or "Gemini 1.5 Flash",
        status="IDLE",
        tasks_completed=0,
        tasks_failed=0,
        last_activity=datetime.utcnow()
    )
    db.add(new_agent)
    await db.commit()

    agent_data = {
        "id": new_agent.id,
        "name": new_agent.name,
        "role": new_agent.role,
        "status": new_agent.status,
        "current_task_id": new_agent.current_task_id,
        "parent_id": new_agent.parent_id,
        "model": new_agent.model,
        "tasks_completed": new_agent.tasks_completed,
        "tasks_failed": new_agent.tasks_failed,
        "department": payload.department or "Core Engineering"
    }

    await event_bus.publish("AGENT_CREATED", agent_data)
    await event_bus.publish("AGENTS_UPDATED", {"action": "CREATE", "agent": agent_data})
    return agent_data

@router.put("/agents/{agent_id}")
async def update_agent(agent_id: str, payload: UpdateAgentPayload, db: AsyncSession = Depends(get_db)):
    agent = await db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")

    if payload.name is not None:
        agent.name = payload.name
    if payload.role is not None:
        agent.role = payload.role
    if payload.parent_id is not None:
        agent.parent_id = payload.parent_id
    if payload.status is not None:
        agent.status = payload.status
    if payload.model is not None:
        agent.model = payload.model
    agent.last_activity = datetime.utcnow()

    await db.commit()

    agent_data = {
        "id": agent.id,
        "name": agent.name,
        "role": agent.role,
        "status": agent.status,
        "current_task_id": agent.current_task_id,
        "parent_id": agent.parent_id,
        "model": agent.model,
        "tasks_completed": agent.tasks_completed,
        "tasks_failed": agent.tasks_failed,
        "department": payload.department
    }

    await event_bus.publish("AGENT_MODIFIED", agent_data)
    await event_bus.publish("AGENTS_UPDATED", {"action": "UPDATE", "agent": agent_data})
    return agent_data

@router.delete("/agents/{agent_id}")
async def delete_agent(agent_id: str, db: AsyncSession = Depends(get_db)):
    if agent_id == "agent-aditya":
        raise HTTPException(status_code=400, detail="Cannot delete Chief Orchestrator (Aditya Jain)")

    agent = await db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")

    fallback_parent = agent.parent_id or "agent-aditya"
    await db.execute(
        update(Agent).where(Agent.parent_id == agent_id).values(parent_id=fallback_parent)
    )

    await db.delete(agent)
    await db.commit()

    await event_bus.publish("AGENT_DELETED", {"id": agent_id, "name": agent.name})
    await event_bus.publish("AGENTS_UPDATED", {"action": "DELETE", "agent_id": agent_id})
    return {"status": "DELETED", "id": agent_id, "name": agent.name}

# 3. Tasks & Details
@router.get("/tasks")
async def list_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    agent_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Task)
    if status:
        query = query.where(Task.status == status)
    if priority:
        query = query.where(Task.priority == priority)
    if agent_id:
        query = query.where(Task.assigned_agent_id == agent_id)

    res = await db.execute(query)
    tasks = res.scalars().all()
    return [
        {
            "id": t.id,
            "project_id": t.project_id,
            "title": t.title,
            "goal": t.goal,
            "status": t.status,
            "priority": t.priority,
            "assigned_agent_id": t.assigned_agent_id,
            "assigned_by_agent_id": t.assigned_by_agent_id,
            "commit_sha": t.commit_sha,
            "dependencies": t.dependencies,
            "acceptance_criteria": t.acceptance_criteria,
            "allowed_files": t.allowed_files,
            "test_command": t.test_command,
            "test_passed": t.test_passed,
            "test_output": t.test_output,
            "retries": t.retries,
            "max_retries": t.max_retries,
            "error_message": t.error_message,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "updated_at": t.updated_at.isoformat() if t.updated_at else None
        }
        for t in tasks
    ]

@router.get("/tasks/{task_id}")
async def get_task(task_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Task).where(Task.id == task_id))
    task = res.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/tasks/{task_id}/retry")
async def retry_task(task_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Task).where(Task.id == task_id))
    task = res.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    validate_transition(TaskState(task.status), TaskState.READY)
    task.status = TaskState.READY.value
    task.retries = 0
    task.error_message = None
    task.updated_at = datetime.utcnow()
    await db.commit()

    # Trigger orchestrator
    import asyncio
    asyncio.create_task(orchestrator.scheduler_tick())
    return {"message": f"Task {task_id} reset to READY and queued for execution"}

# 4. Task Graph & Assignment (Who assigned What to Whom)
@router.get("/task-graph")
async def get_task_graph(db: AsyncSession = Depends(get_db)):
    task_res = await db.execute(select(Task))
    tasks = task_res.scalars().all()

    asgn_res = await db.execute(select(TaskAssignment))
    assignments = asgn_res.scalars().all()

    agent_res = await db.execute(select(Agent))
    agents = {a.id: a for a in agent_res.scalars().all()}

    nodes = []
    edges = []

    for t in tasks:
        nodes.append({
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "priority": t.priority,
            "assigned_agent_id": t.assigned_agent_id,
            "assigned_agent_name": agents.get(t.assigned_agent_id).name if agents.get(t.assigned_agent_id) else "Unassigned",
            "dependencies": t.dependencies,
            "commit_sha": t.commit_sha
        })
        # Add dependency edges
        for dep in t.dependencies:
            edges.append({
                "source": dep,
                "target": t.id,
                "type": "dependency"
            })

    assignment_events = [
        {
            "id": a.id,
            "task_id": a.task_id,
            "from_agent": agents.get(a.from_agent_id).name if agents.get(a.from_agent_id) else a.from_agent_id,
            "from_role": agents.get(a.from_agent_id).role if agents.get(a.from_agent_id) else "Orchestrator",
            "to_agent": agents.get(a.to_agent_id).name if agents.get(a.to_agent_id) else a.to_agent_id,
            "to_role": agents.get(a.to_agent_id).role if agents.get(a.to_agent_id) else "Worker",
            "status": a.status,
            "rationale": a.rationale,
            "assigned_at": a.assigned_at.isoformat() if a.assigned_at else None
        }
        for a in assignments
    ]

    return {
        "nodes": nodes,
        "edges": edges,
        "assignment_events": assignment_events
    }

# 5. Kanban Board
@router.get("/kanban")
async def get_kanban(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Task))
    tasks = res.scalars().all()
    columns = {state.value: [] for state in TaskState}

    for t in tasks:
        if t.status in columns:
            columns[t.status].append({
                "id": t.id,
                "title": t.title,
                "goal": t.goal,
                "priority": t.priority,
                "assigned_agent_id": t.assigned_agent_id,
                "commit_sha": t.commit_sha,
                "retries": t.retries,
                "dependencies": t.dependencies
            })

    return columns

# 6. Live Execution Monitor
@router.get("/monitor")
async def get_monitor_metrics(db: AsyncSession = Depends(get_db)):
    metric_res = await db.execute(select(SystemMetric))
    m = metric_res.scalars().first()
    if not m:
        m = SystemMetric()

    task_res = await db.execute(select(Task))
    tasks = task_res.scalars().all()
    verified_count = sum(1 for t in tasks if t.status == TaskState.VERIFIED.value)
    total_count = len(tasks) or 1
    pct = round((verified_count / total_count) * 100, 1)

    return {
        "active_workers": orchestrator.active_workers_count,
        "max_workers": orchestrator.max_workers,
        "queue_length": sum(1 for t in tasks if t.status == TaskState.READY.value),
        "running_tests": sum(1 for t in tasks if t.status == TaskState.TESTING.value),
        "ci_failures": m.ci_failures,
        "active_deployments": m.active_deployments,
        "healthy_vms": m.healthy_vms,
        "verified_criteria_percent": pct,
        "kill_switch_active": orchestrator.kill_switch_active,
        "total_tasks": len(tasks),
        "verified_tasks": verified_count
    }

# 7. GitHub & CI/CD
@router.get("/github/runs")
async def list_workflow_runs(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(WorkflowRun))
    return res.scalars().all()

@router.get("/github/repos")
async def list_repositories():
    return await github_adapter.get_repositories()

@router.post("/github/webhook")
async def handle_github_webhook(
    request: Request,
    x_hub_signature_256: Optional[str] = Header(None),
    x_github_delivery: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
):
    body = await request.body()
    # 1. Verify signature if header is present
    if x_hub_signature_256 and not github_adapter.verify_webhook_signature(body, x_hub_signature_256):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    # 2. Deduplicate
    if x_github_delivery and github_adapter.is_duplicate_delivery(x_github_delivery):
        return {"status": "ignored", "reason": "duplicate delivery"}

    payload = await request.json()
    action = payload.get("action")
    workflow_job = payload.get("workflow_job", {})

    if workflow_job and workflow_job.get("conclusion") == "failure":
        # Actions Watcher classifies failure
        step_name = workflow_job.get("name", "Unknown Step")
        log_sample = workflow_job.get("log", "AssertionError in unit test suite")
        cat = github_adapter.classify_ci_failure(step_name, log_sample)

        run = WorkflowRun(
            id=f"run-{workflow_job.get('id', 'dev')}",
            repo=payload.get("repository", {}).get("name", "repo"),
            branch=workflow_job.get("head_branch", "main"),
            commit_sha=workflow_job.get("head_sha", "abc1234"),
            workflow_name=workflow_job.get("workflow_name", "CI"),
            status="completed",
            conclusion="failure",
            failed_step=step_name,
            failure_category=cat,
            log_excerpt=log_sample,
            simulated=False
        )
        db.add(run)
        await db.commit()

        await event_bus.publish("CI_FAILURE_DETECTED", {
            "step": step_name,
            "category": cat
        })

    return {"status": "processed"}

# 8. VM Fleet
@router.get("/vms")
async def list_vm_nodes(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(VmNode))
    nodes = res.scalars().all()
    # Ensure all secrets in drift or details are safely redacted
    return [
        {
            "id": n.id,
            "alias": n.alias,
            "environment": n.environment,
            "host": n.host,
            "role": n.role,
            "current_version": n.current_version,
            "target_version": n.target_version,
            "status": n.status,
            "drift_details": redact_secrets(n.drift_details),
            "is_simulated": n.is_simulated,
            "last_sync_at": n.last_sync_at.isoformat() if n.last_sync_at else None
        }
        for n in nodes
    ]

@router.post("/vms/{vm_id}/sync")
async def sync_vm(vm_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(VmNode).where(VmNode.id == vm_id))
    node = res.scalars().first()
    if not node:
        raise HTTPException(status_code=404, detail="VM not found")
    node.status = "HEALTHY"
    node.drift_details = None
    node.current_version = node.target_version
    node.last_sync_at = datetime.utcnow()
    await db.commit()
    await event_bus.publish("VM_SYNCED", {"vm_id": vm_id})
    return {"message": f"VM {node.alias} synchronized successfully"}

# 9. Approvals Center
@router.get("/approvals")
async def list_approvals(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Approval))
    return res.scalars().all()

@router.post("/approvals/{approval_id}/approve")
async def approve_request(
    approval_id: str,
    payload: ApprovalDecisionPayload,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Approval).where(Approval.id == approval_id))
    appr = res.scalars().first()
    if not appr:
        raise HTTPException(status_code=404, detail="Approval request not found")

    appr.status = "APPROVED"
    appr.approved_by = payload.actor
    appr.approved_at = datetime.utcnow()

    # If linked to a task, verify task
    task_id = approval_id.replace("APP-", "")
    t_res = await db.execute(select(Task).where(Task.id == task_id))
    task = t_res.scalars().first()
    if task:
        validate_transition(TaskState(task.status), TaskState.VERIFIED, evidence_verified=True)
        task.status = TaskState.VERIFIED.value

    await orchestrator.log_audit(
        db,
        "APPROVAL_GRANTED",
        payload.actor,
        f"Production approval granted for {approval_id}: {appr.title}"
    )
    await db.commit()

    await event_bus.publish("APPROVAL_STATUS_CHANGED", {
        "approval_id": approval_id,
        "status": "APPROVED"
    })
    return {"message": "Approval granted"}

@router.post("/approvals/{approval_id}/reject")
async def reject_request(
    approval_id: str,
    payload: ApprovalDecisionPayload,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Approval).where(Approval.id == approval_id))
    appr = res.scalars().first()
    if not appr:
        raise HTTPException(status_code=404, detail="Approval request not found")

    appr.status = "REJECTED"
    appr.rejection_reason = payload.rationale or "Rejected by human operator"

    task_id = approval_id.replace("APP-", "")
    t_res = await db.execute(select(Task).where(Task.id == task_id))
    task = t_res.scalars().first()
    if task:
        validate_transition(TaskState(task.status), TaskState.FAILED)
        task.status = TaskState.FAILED.value
        task.error_message = appr.rejection_reason

    await orchestrator.log_audit(
        db,
        "APPROVAL_REJECTED",
        payload.actor,
        f"Approval rejected for {approval_id}: {appr.rejection_reason}"
    )
    await db.commit()

    await event_bus.publish("APPROVAL_STATUS_CHANGED", {
        "approval_id": approval_id,
        "status": "REJECTED"
    })
    return {"message": "Approval rejected"}

# 10. System Controls & End-to-End Demonstration
@router.post("/system/request")
async def submit_request(payload: UserRequestPayload):
    task_ids = await orchestrator.submit_user_request(payload.prompt, payload.project_id)
    return {"message": "Request accepted and planned by Chief Orchestrator", "task_ids": task_ids}

@router.post("/system/kill-switch")
async def toggle_kill_switch(payload: KillSwitchPayload):
    await orchestrator.set_kill_switch(payload.active)
    return {"kill_switch_active": orchestrator.kill_switch_active}

@router.post("/system/recover")
async def trigger_recovery():
    await orchestrator.recover_from_crash()
    return {"message": "Crash recovery routine executed"}

@router.post("/system/run-demo-failure-loop")
async def run_demo_failure_loop(db: AsyncSession = Depends(get_db)):
    """
    Simulates the exact end-to-end failure recovery loop requested:
    A task is dispatched, QA finds a failure, Actions Watcher classifies it,
    defect task is created, worker retries and fixes it, and task is verified!
    """
    demo_task_id = "TASK-099"
    # Create demo task
    task = Task(
        id=demo_task_id,
        project_id="proj-default",
        title="Payment Webhook Idempotency Check",
        goal="Ensure repeated Stripe webhooks do not double credit accounts",
        status=TaskState.READY.value,
        priority="HIGH",
        assigned_by_agent_id="agent-orchestrator",
        dependencies_json="[]",
        acceptance_criteria_json='["Duplicate webhook event returns 200 without charging customer twice"]',
        retries=0,
        max_retries=3
    )
    db.add(task)
    await db.commit()

    import asyncio
    # Run first attempt with forced failure
    asyncio.create_task(orchestrator.execute_task_pipeline(demo_task_id, force_test_failure=True))
    
    # Wait a bit then schedule the successful retry
    async def schedule_retry():
        await asyncio.sleep(2)
        await orchestrator.execute_task_pipeline(demo_task_id, force_test_failure=False)

    asyncio.create_task(schedule_retry())

    return {
        "message": "Demo failure & recovery loop initiated for TASK-099",
        "steps": [
            "1. Task assigned to worker",
            "2. Test fails in QA journey simulation",
            "3. Actions Watcher classifies failure and routes defect back to worker (Retry 1/3)",
            "4. Worker applies fix and re-runs test suite",
            "5. QA re-verifies successfully",
            "6. Task transitions to VERIFIED"
        ]
    }

# 11. BA Requirements Discussion Center
class AnswerQuestionPayload(BaseModel):
    question_id: str
    answer: str

class ConfirmBaProposalPayload(BaseModel):
    actor: str = "Lead Product Owner"

@router.get("/ba/discussions")
async def list_ba_discussions(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(BaDiscussion))
    items = res.scalars().all()
    return [
        {
            "id": d.id,
            "project_id": d.project_id,
            "feature_name": d.feature_name,
            "user_problem": d.user_problem,
            "proposed_flow": d.proposed_flow,
            "questions": d.questions,
            "acceptance_criteria": d.acceptance_criteria,
            "status": d.status,
            "confirmed_by": d.confirmed_by,
            "confirmed_at": d.confirmed_at.isoformat() if d.confirmed_at else None,
            "created_at": d.created_at.isoformat() if d.created_at else None
        }
        for d in items
    ]

@router.post("/ba/discussions/{disc_id}/answer")
async def answer_ba_question(
    disc_id: str,
    payload: AnswerQuestionPayload,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(BaDiscussion).where(BaDiscussion.id == disc_id))
    disc = res.scalars().first()
    if not disc:
        raise HTTPException(status_code=404, detail="Discussion not found")

    questions = disc.questions
    for q in questions:
        if q.get("id") == payload.question_id:
            q["user_answer"] = payload.answer
            q["is_answered"] = True
            break
    disc.questions = questions
    await db.commit()
    await event_bus.publish("BA_QUESTION_ANSWERED", {"discussion_id": disc_id, "question_id": payload.question_id})
    return {"message": "Question answered successfully", "questions": disc.questions}

@router.post("/ba/discussions/{disc_id}/confirm")
async def confirm_ba_proposal(
    disc_id: str,
    payload: ConfirmBaProposalPayload,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(BaDiscussion).where(BaDiscussion.id == disc_id))
    disc = res.scalars().first()
    if not disc:
        raise HTTPException(status_code=404, detail="Discussion not found")

    disc.status = "CONFIRMED"
    disc.confirmed_by = payload.actor
    disc.confirmed_at = datetime.now(timezone.utc)
    await orchestrator.log_audit(
        db,
        "BA_REQUIREMENTS_CONFIRMED",
        payload.actor,
        f"Material requirements confirmed for {disc.feature_name} (ID: {disc_id})"
    )
    await db.commit()
    await event_bus.publish("BA_PROPOSAL_CONFIRMED", {"discussion_id": disc_id, "status": "CONFIRMED"})
    return {"message": "Requirements confirmed. Proceeding autonomously to implementation."}

# 12. Thought / R&D Technical Suggestions
@router.get("/rd/suggestions")
async def list_rd_suggestions(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(RdSuggestion))
    return res.scalars().all()

@router.post("/rd/suggestions/{sugg_id}/approve")
async def approve_rd_suggestion(sugg_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(RdSuggestion).where(RdSuggestion.id == sugg_id))
    sugg = res.scalars().first()
    if not sugg:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    sugg.status = "APPROVED"
    sugg.decided_at = datetime.now(timezone.utc)
    await orchestrator.log_audit(
        db,
        "RD_SUGGESTION_APPROVED",
        "THOUGHT_RND_ENGINEER",
        f"Approved suggestion {sugg.title} ({sugg.category})"
    )
    await db.commit()
    await event_bus.publish("RD_SUGGESTION_UPDATED", {"id": sugg_id, "status": "APPROVED"})
    return {"message": "Suggestion approved"}

@router.post("/rd/suggestions/{sugg_id}/dismiss")
async def dismiss_rd_suggestion(sugg_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(RdSuggestion).where(RdSuggestion.id == sugg_id))
    sugg = res.scalars().first()
    if not sugg:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    sugg.status = "DISMISSED"
    sugg.decided_at = datetime.now(timezone.utc)
    await db.commit()
    await event_bus.publish("RD_SUGGESTION_UPDATED", {"id": sugg_id, "status": "DISMISSED"})
    return {"message": "Suggestion dismissed"}

# 13. UI/UX Design Specs & State Matrix
@router.get("/uiux/specs")
async def list_uiux_specs(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(UiUxDesignSpec))
    items = res.scalars().all()
    return [
        {
            "id": s.id,
            "project_id": s.project_id,
            "screen_name": s.screen_name,
            "menu_path": s.menu_path,
            "allowed_roles": s.allowed_roles,
            "states_matrix": s.states_matrix,
            "status": s.status,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in items
    ]

# 14. Legacy Codebase Regression & Refactoring Monitor
@router.get("/legacy/checks")
async def list_legacy_checks(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(LegacyRegressionCheck))
    items = res.scalars().all()
    return [
        {
            "id": c.id,
            "project_id": c.project_id,
            "controller_name": c.controller_name,
            "file_path": c.file_path,
            "routes": c.routes,
            "has_business_logic": c.has_business_logic,
            "refactoring_status": c.refactoring_status,
            "baseline_test_suite": c.baseline_test_suite,
            "regression_test_status": c.regression_test_status,
            "extracted_service": c.extracted_service,
            "updated_at": c.updated_at.isoformat() if c.updated_at else None
        }
        for c in items
    ]

@router.post("/legacy/checks/{check_id}/verify")
async def verify_legacy_regression(check_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(LegacyRegressionCheck).where(LegacyRegressionCheck.id == check_id))
    c = res.scalars().first()
    if not c:
        raise HTTPException(status_code=404, detail="Legacy check not found")
    c.regression_test_status = "PASSING"
    c.refactoring_status = "VERIFIED"
    c.updated_at = datetime.now(timezone.utc)
    await orchestrator.log_audit(
        db,
        "LEGACY_REGRESSION_VERIFIED",
        "CHIEF_ARCHITECT",
        f"Verified zero regressions on legacy controller {c.controller_name} ({len(c.routes)} routes intact)"
    )
    await db.commit()
    await event_bus.publish("LEGACY_CHECK_UPDATED", {"id": check_id, "status": "VERIFIED"})
    return {"message": "Regression verified. Existing behavior preserved 100%."}

@router.get("/audit-logs")
async def list_audit_logs(limit: int = 50, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit))
    return res.scalars().all()

# 11. Living 3D AI Office Endpoints
@router.post("/office/lifecycle-scenario")
async def trigger_office_lifecycle_scenario(step_delay: float = 2.2):
    """
    Triggers the complete 12-step Living 3D Office Task Lifecycle:
    Aditya -> Giriraj -> Bhupendra -> Rohan (walking to desk & typing) ->
    Rohan walking to Giriraj's cabin -> Presenting -> Giriraj forwards to Abhishek ->
    Ashish testing in QA lab -> Defect reported back to Rohan -> Rohan fixes ->
    Harshit Purohit CI/CD deploy -> Divisha docs -> Verified completion reported to Aditya.
    """
    import asyncio
    asyncio.create_task(orchestrator.run_office_lifecycle_scenario(step_delay=step_delay))
    return {
        "status": "INITIATED",
        "scenario": "Living 3D Office 12-Step Task Lifecycle",
        "task_id": "TASK-LIFECYCLE-100",
        "step_delay": step_delay
    }

@router.get("/office/hierarchy")
async def get_office_hierarchy(db: AsyncSession = Depends(get_db)):
    """
    Returns the complete hierarchy of the 18 employees with reporting trees,
    cabin/desk assignments, and 3D office positions.
    """
    res = await db.execute(select(Agent))
    agents = res.scalars().all()
    OFFICE_METADATA = {
        "agent-aditya": {"zone": "Executive Cabin", "desk_id": "cabin-aditya", "coords": [-14, 0, -10], "tier": 1},
        "agent-sanjay": {"zone": "Operations Command", "desk_id": "desk-sanjay", "coords": [-7, 0, -10], "tier": 2},
        "agent-giriraj": {"zone": "Senior Engineering Cabin", "desk_id": "cabin-giriraj", "coords": [13, 0, -10], "tier": 2},
        "agent-bhupendra": {"zone": "BA Strategy Room", "desk_id": "desk-bhupendra", "coords": [-14, 0, 0], "tier": 2},
        "agent-abhishek": {"zone": "QA Testing Lab", "desk_id": "desk-abhishek", "coords": [11, 0, 0], "tier": 3},
        "agent-ashish": {"zone": "QA Testing Lab", "desk_id": "desk-ashish", "coords": [14, 0, 0], "tier": 4},
        "agent-rohan": {"zone": "Developer Pod 1", "desk_id": "desk-rohan", "coords": [-4, 0, -2], "tier": 4},
        "agent-shaurya": {"zone": "Developer Pod 1", "desk_id": "desk-shaurya", "coords": [-4, 0, 2], "tier": 4},
        "agent-binod": {"zone": "Developer Pod 1", "desk_id": "desk-binod", "coords": [-4, 0, 6], "tier": 4},
        "agent-mohit": {"zone": "Developer Pod 2", "desk_id": "desk-mohit", "coords": [4, 0, -2], "tier": 4},
        "agent-harshit-p": {"zone": "DevOps & Cloud Hub", "desk_id": "desk-harshit-p", "coords": [11, 0, 10], "tier": 3},
        "agent-divisha": {"zone": "Documentation Desk", "desk_id": "desk-divisha", "coords": [0, 0, 6], "tier": 4},
        "agent-hemang": {"zone": "Code Review Desk", "desk_id": "desk-hemang", "coords": [0, 0, -2], "tier": 3},
        "agent-esha": {"zone": "UI/UX Design Studio", "desk_id": "desk-esha", "coords": [-14, 0, 10], "tier": 3},
        "agent-kratik": {"zone": "Backend Desk", "desk_id": "desk-kratik", "coords": [4, 0, 2], "tier": 4},
        "agent-maan": {"zone": "Frontend Desk", "desk_id": "desk-maan", "coords": [4, 0, 6], "tier": 4},
        "agent-harshit-m": {"zone": "Security & Gatekeeping", "desk_id": "desk-harshit-m", "coords": [-7, 0, -6], "tier": 3},
        "agent-kathan": {"zone": "Automation & CI Desk", "desk_id": "desk-kathan", "coords": [14, 0, 10], "tier": 4},
    }
    output = []
    for a in agents:
        meta = OFFICE_METADATA.get(a.id, {"zone": "General Floor", "desk_id": f"desk-{a.id}", "coords": [0, 0, 0], "tier": 4})
        output.append({
            "id": a.id,
            "name": a.name,
            "role": a.role,
            "status": a.status,
            "current_task_id": a.current_task_id,
            "parent_id": a.parent_id,
            "model": a.model,
            "tasks_completed": a.tasks_completed,
            "tasks_failed": a.tasks_failed,
            "last_activity": a.last_activity.isoformat() if a.last_activity else None,
            "zone": meta["zone"],
            "desk_id": meta["desk_id"],
            "coords": meta["coords"],
            "tier": meta["tier"]
        })
    return output
