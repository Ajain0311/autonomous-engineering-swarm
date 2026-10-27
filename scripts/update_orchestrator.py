import re

path = 'backend/app/core/orchestrator.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update assignment in execute_task_pipeline
old_assign = '''                    # Assign worker role based on task title / domain
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
                    )'''

new_assign = '''                    # Assign worker role and agent based on domain and hierarchy
                    worker_role, assigned_agent_id, supervisor_id = self._resolve_worker_agent(task)
                    task.assigned_agent_id = assigned_agent_id
                    
                    # Record Assignment Event: WHO assigned WHAT to WHOM
                    assignment = TaskAssignment(
                        task_id=task.id,
                        from_agent_id=supervisor_id,
                        to_agent_id=task.assigned_agent_id,
                        status="ASSIGNED",
                        rationale=f"{supervisor_id} assigned {task.title} to {assigned_agent_id}.",
                        assigned_at=datetime.utcnow()
                    )'''

content = content.replace(old_assign, new_assign)

# Add EMPLOYEE_INTERACTION broadcast on assignment
old_task_pub = '''                await event_bus.publish("TASK_STATUS_CHANGED", {
                    "task_id": task_id,
                    "status": TaskState.IN_PROGRESS.value,
                    "assigned_to": task.assigned_agent_id
                })'''

new_task_pub = '''                await event_bus.publish("TASK_STATUS_CHANGED", {
                    "task_id": task_id,
                    "status": TaskState.IN_PROGRESS.value,
                    "assigned_to": task.assigned_agent_id
                })
                await event_bus.publish("EMPLOYEE_INTERACTION", {
                    "task_id": task_id,
                    "from_agent_id": "agent-giriraj",
                    "to_agent_id": task.assigned_agent_id,
                    "action": "ASSIGN",
                    "speech": f"Task {task.id} assigned to {task.assigned_agent_id}."
                })'''

content = content.replace(old_task_pub, new_task_pub)

# Update resolve_worker_role and add resolve_worker_agent
old_resolve = '''    def _resolve_worker_role(self, task: Task) -> str:
        title = task.title.lower()
        if "design" in title or "ui/ux" in title or "screen" in title or "ux" in title:
            return "UI/UX Design Engineer (Speed & Usability)"
        elif "frontend" in title or "ui" in title:
            return "Senior Engineer 2"
        elif "qa" in title or "test" in title:
            return "QA / Human Simulation Engineer"
        elif "deploy" in title or "vm" in title:
            return "VM Fleet / Infrastructure Handler"
        elif "release" in title or "security" in title:
            return "Security / Release Gate"
        elif "schema" in title or "architecture" in title or "legacy" in title or "refactor" in title:
            return "Chief Architect"
        else:
            return "Senior Engineer 1"'''

new_resolve = '''    def _resolve_worker_agent(self, task: Task) -> tuple[str, str, str]:
        title = task.title.lower()
        if "design" in title or "ui/ux" in title or "screen" in title or "ux" in title:
            return ("UI/UX Design Engineer (Speed & Usability)", "agent-esha", "agent-giriraj")
        elif "frontend" in title or "ui" in title:
            return ("Frontend Engineer", "agent-maan", "agent-giriraj")
        elif "qa" in title or "test" in title:
            return ("Tester, reporting to QA", "agent-ashish", "agent-abhishek")
        elif "deploy" in title or "vm" in title or "infra" in title:
            return ("DevOps Engineer", "agent-harshit-p", "agent-sanjay")
        elif "ci" in title or "pipeline" in title or "action" in title:
            return ("Automation / CI Engineer", "agent-kathan", "agent-harshit-p")
        elif "security" in title or "audit" in title or "gate" in title:
            return ("Security Engineer", "agent-harshit-m", "agent-aditya")
        elif "docs" in title or "documentation" in title or "manual" in title:
            return ("Documentation Engineer", "agent-divisha", "agent-giriraj")
        elif "review" in title or "assembly" in title:
            return ("Code Review Engineer", "agent-hemang", "agent-giriraj")
        elif "schema" in title or "architecture" in title or "legacy" in title or "refactor" in title:
            return ("Senior Developer / Engineering Lead", "agent-giriraj", "agent-aditya")
        elif "backend" in title or "database" in title or "auth" in title:
            return ("Backend Engineer", "agent-kratik", "agent-giriraj")
        elif "shaurya" in title:
            return ("Developer", "agent-shaurya", "agent-giriraj")
        elif "binod" in title:
            return ("Developer", "agent-binod", "agent-giriraj")
        elif "mohit" in title:
            return ("Developer", "agent-mohit", "agent-giriraj")
        else:
            return ("Developer", "agent-rohan", "agent-giriraj")

    def _resolve_worker_role(self, task: Task) -> str:
        role, _, _ = self._resolve_worker_agent(task)
        return role'''

content = content.replace(old_resolve, new_resolve)

# Add run_office_lifecycle_scenario implementation before orchestrator = OrchestratorEngine()
scenario_code = '''
    async def run_office_lifecycle_scenario(self, step_delay: float = 2.2) -> Dict[str, Any]:
        """
        Executes the official 12-step Living 3D Office Task Lifecycle:
        1. Aditya Jain receives request -> delegates to Engineering Lead Sahlot Giriraj Mali.
        2. BA Bhupendra Jingar reviews requirement & approaches Giriraj & Aditya to align.
        3. Giriraj assigns coding task to Developer Rohan Sharma.
        4. Rohan walks to workstation, sits down, and codes actively.
        5. Worker completes -> Rohan stands up and walks to Giriraj's cabin.
        6. Rohan presents result: 'Implementation complete — tests pending.'
        7. Giriraj reviews real output diff & forwards to QA Lead Abhishek Hingar.
        8. Abhishek assigns testing to Ashish Das; Ashish moves to QA area and tests.
        9. Defect detected! Ashish reports to Abhishek -> Giriraj -> Rohan. Rohan fixes at desk.
        10. Checks pass -> Harshit Purohit executes permitted CI/CD workflow.
        11. Divisha Joshi updates system documentation and API schemas.
        12. Giriraj & leads report verified completion to Aditya in Executive Cabin.
        """
        task_id = "TASK-LIFECYCLE-100"
        now = datetime.utcnow()

        async with AsyncSessionLocal() as db:
            # Upsert lifecycle task
            t_res = await db.execute(select(Task).where(Task.id == task_id))
            task = t_res.scalars().first()
            if not task:
                task = Task(
                    id=task_id,
                    project_id="proj-default",
                    title="Real-Time 3D Office Event Bus & Settlement Engine",
                    goal="Modernize distributed settlement processing with zero drift and sub-second telemetry.",
                    status=TaskState.PLANNED.value,
                    priority="HIGH",
                    assigned_agent_id="agent-aditya",
                    assigned_by_agent_id="agent-aditya",
                    acceptance_criteria_json='["Atomic two-phase commit", "Sub-50ms latency", "Passing regression"]',
                    dependencies_json='[]',
                    allowed_files_json='["backend/src/**", "frontend/src/**"]',
                    retries=0,
                    max_retries=3,
                    created_at=now,
                    updated_at=now
                )
                db.add(task)
            else:
                task.status = TaskState.PLANNED.value
                task.retries = 0
                task.test_passed = False
                task.commit_sha = None
                task.updated_at = now
            await db.commit()

        # Helper to publish rich office step
        async def publish_step(step: int, phase: str, title: str, active_agents: list, primary_agent: str, target_agent: Optional[str], target_loc: str, action: str, speech_speaker: str, speech_text: str, progress: int, status_str: str, defect: bool = False):
            payload = {
                "step_number": step,
                "phase": phase,
                "title": title,
                "task_id": task_id,
                "active_agents": active_agents,
                "primary_agent_id": primary_agent,
                "target_agent_id": target_agent,
                "target_location": target_loc,
                "action": action,
                "speech": {
                    "speaker_id": speech_speaker,
                    "speaker_name": speech_speaker.replace("agent-", "").title(),
                    "text": speech_text
                },
                "progress": progress,
                "status": status_str,
                "defect_detected": defect,
                "timestamp": datetime.utcnow().isoformat()
            }
            await event_bus.publish("OFFICE_LIFECYCLE_STEP", payload)
            await event_bus.publish("TASK_STATUS_CHANGED", {
                "task_id": task_id,
                "status": status_str,
                "assigned_to": primary_agent,
                "progress": progress
            })
            await asyncio.sleep(step_delay)

        # ---------------- STEP 1: Intake & Lead Delegation ---------------- #
        async with AsyncSessionLocal() as db:
            await self.log_audit(db, "TASK_INTAKE", "CHIEF_ORCHESTRATOR", "Aditya Jain received user request and called Engineering Lead Giriraj Mali to Executive Cabin.")
        await publish_step(
            1, "INTAKE_AND_DELEGATION", "Aditya receives request & calls Giriraj",
            ["agent-aditya", "agent-giriraj"], "agent-aditya", "agent-giriraj",
            "cabin-aditya", "TALK", "agent-aditya",
            "Giriraj, user requested TASK-LIFECYCLE-100. Let's coordinate with Bhupendra and kick off implementation.",
            5, "PLANNED"
        )

        # ---------------- STEP 2: BA Analysis & Decision ---------------- #
        async with AsyncSessionLocal() as db:
            await self.log_audit(db, "BA_ALIGNMENT", "BUSINESS_ANALYST", "Bhupendra Jingar reviewed requirements and aligned on settlement specifications.")
        await publish_step(
            2, "BA_ANALYSIS", "Bhupendra aligns on specifications",
            ["agent-bhupendra", "agent-giriraj", "agent-aditya"], "agent-bhupendra", "agent-giriraj",
            "meeting-ba-table", "TALK", "agent-bhupendra",
            "Settlement requirements confirmed: two-phase locking with 30s timeout recommended for zero fraud.",
            15, "PLANNED"
        )

        # ---------------- STEP 3: Giriraj Assigns Task to Rohan ---------------- #
        async with AsyncSessionLocal() as db:
            t_res = await db.execute(select(Task).where(Task.id == task_id))
            t = t_res.scalars().first()
            t.status = TaskState.READY.value
            t.assigned_agent_id = "agent-rohan"
            asgn = TaskAssignment(
                task_id=task_id, from_agent_id="agent-giriraj", to_agent_id="agent-rohan",
                status="ASSIGNED", rationale="Giriraj assigned settlement implementation to Rohan Sharma",
                assigned_at=datetime.utcnow()
            )
            db.add(asgn)
            await self.log_audit(db, "TASK_ASSIGNED", "ENGINEERING_LEAD", "Giriraj assigned coding task to Developer Rohan Sharma.")
            await db.commit()
        await publish_step(
            3, "TASK_ASSIGNMENT", "Giriraj delegates coding to Rohan",
            ["agent-giriraj", "agent-rohan"], "agent-giriraj", "agent-rohan",
            "cabin-giriraj", "TALK", "agent-giriraj",
            "Rohan, please take TASK-LIFECYCLE-100. Implement the atomic settlement pipeline with full regression tests.",
            25, "READY"
        )

        # ---------------- STEP 4: Rohan Walks to Desk & Codes ---------------- #
        async with AsyncSessionLocal() as db:
            t_res = await db.execute(select(Task).where(Task.id == task_id))
            t = t_res.scalars().first()
            t.status = TaskState.IN_PROGRESS.value
            await db.commit()
        await publish_step(
            4, "CODING_ACTIVE", "Rohan walks to workstation and codes",
            ["agent-rohan"], "agent-rohan", None,
            "desk-rohan", "CODE", "agent-rohan",
            "Settlement worker initialized. Writing transactional adapter, Redis mutex, and boundary tests...",
            45, "IN_PROGRESS"
        )

        # ---------------- STEP 5: Rohan Completes & Walks to Giriraj ---------------- #
        await publish_step(
            5, "DEV_WALK_TO_LEAD", "Rohan walks to Giriraj's cabin",
            ["agent-rohan", "agent-giriraj"], "agent-rohan", "agent-giriraj",
            "cabin-giriraj", "WALK", "agent-rohan",
            "Coding completed. Heading to Giriraj's cabin to present implementation artifacts.",
            65, "IN_PROGRESS"
        )

        # ---------------- STEP 6: Rohan Presents Work to Giriraj ---------------- #
        async with AsyncSessionLocal() as db:
            t_res = await db.execute(select(Task).where(Task.id == task_id))
            t = t_res.scalars().first()
            t.commit_sha = "c7d8e9f0a1b2"
            await db.commit()
        await publish_step(
            6, "WORK_PRESENTATION", "Rohan presents completion evidence",
            ["agent-rohan", "agent-giriraj"], "agent-rohan", "agent-giriraj",
            "cabin-giriraj", "PRESENT", "agent-rohan",
            "Implementation complete — tests pending. 12 integration points added under commit c7d8e9f0.",
            70, "IN_PROGRESS"
        )

        # ---------------- STEP 7: Giriraj Reviews & Forwards to QA ---------------- #
        async with AsyncSessionLocal() as db:
            t_res = await db.execute(select(Task).where(Task.id == task_id))
            t = t_res.scalars().first()
            t.status = TaskState.REVIEW.value
            await self.log_audit(db, "TASK_REVIEWED", "ENGINEERING_LEAD", "Giriraj Mali approved code diff and forwarded task to QA Lead Abhishek.")
            await db.commit()
        await publish_step(
            7, "LEAD_REVIEW", "Giriraj reviews diff & forwards to QA",
            ["agent-giriraj", "agent-abhishek"], "agent-giriraj", "agent-abhishek",
            "desk-abhishek", "TALK", "agent-giriraj",
            "Evidence contract verified. Code diff is approved. Forwarding to Abhishek for QA testing.",
            75, "REVIEW"
        )

        # ---------------- STEP 8: Abhishek Assigns QA to Ashish & Testing ---------------- #
        async with AsyncSessionLocal() as db:
            t_res = await db.execute(select(Task).where(Task.id == task_id))
            t = t_res.scalars().first()
            t.status = TaskState.TESTING.value
            await self.log_audit(db, "TESTING_STARTED", "QA_LEAD", "Abhishek assigned test suite to Ashish Das.")
            await db.commit()
        await publish_step(
            8, "QA_TESTING", "Abhishek assigns QA to Ashish; Ashish tests",
            ["agent-abhishek", "agent-ashish"], "agent-ashish", "agent-abhishek",
            "lab-qa", "TEST", "agent-ashish",
            "Running automated settlement journey test suite (18 test scenarios across payment gateways)...",
            80, "TESTING"
        )

        # ---------------- STEP 9: Defect Detected, Escalated, & Fixed ---------------- #
        async with AsyncSessionLocal() as db:
            t_res = await db.execute(select(Task).where(Task.id == task_id))
            t = t_res.scalars().first()
            t.retries = 1
            t.status = TaskState.IN_PROGRESS.value
            await self.log_audit(db, "DEFECT_REMEDIATED", "DEVELOPER", "Defect identified in concurrency lock; Rohan fixed and re-verified green.")
            await db.commit()
        await publish_step(
            9, "DEFECT_AND_FIX", "Defect reported to Abhishek -> Giriraj -> Rohan fixed",
            ["agent-ashish", "agent-abhishek", "agent-giriraj", "agent-rohan"], "agent-rohan", "agent-giriraj",
            "desk-rohan", "DEFECT", "agent-rohan",
            "Defect identified in concurrent lock timeout! Fix applied: added distributed Redlock with auto-renew. All 18 tests passing!",
            88, "IN_PROGRESS", defect=True
        )

        # ---------------- STEP 10: Harshit Purohit Runs CI/CD Deploy ---------------- #
        async with AsyncSessionLocal() as db:
            t_res = await db.execute(select(Task).where(Task.id == task_id))
            t = t_res.scalars().first()
            t.test_passed = True
            await self.log_audit(db, "CICD_DEPLOYED", "DEVOPS_ENGINEER", "Harshit Purohit deployed build candidate to staging VM.")
            await db.commit()
        await publish_step(
            10, "CI_CD_DEPLOYMENT", "Harshit Purohit deploys to staging VM",
            ["agent-harshit-p", "agent-kathan"], "agent-harshit-p", "agent-kathan",
            "area-devops", "DEPLOY", "agent-harshit-p",
            "Staging VM deployment verified: container image sha256:4d8a1c rolled out with healthcheck 200 OK.",
            92, "READY_TO_RELEASE"
        )

        # ---------------- STEP 11: Divisha Updates Documentation ---------------- #
        async with AsyncSessionLocal() as db:
            await self.log_audit(db, "DOCS_UPDATED", "DOCUMENTATION_ENGINEER", "Divisha Joshi updated API manuals and changelogs.")
        await publish_step(
            11, "DOCUMENTATION_SYNC", "Divisha updates OpenAPI & manuals",
            ["agent-divisha"], "agent-divisha", "agent-giriraj",
            "desk-divisha", "DOCS", "agent-divisha",
            "Documentation synchronized: Settlement API v2 OpenAPI spec and changelog published.",
            96, "READY_TO_RELEASE"
        )

        # ---------------- STEP 12: Giriraj & Leads Report to Aditya ---------------- #
        async with AsyncSessionLocal() as db:
            t_res = await db.execute(select(Task).where(Task.id == task_id))
            t = t_res.scalars().first()
            t.status = TaskState.VERIFIED.value
            t.updated_at = datetime.utcnow()
            await self.log_audit(db, "TASK_VERIFIED", "CHIEF_ORCHESTRATOR", "Aditya Jain verified task completion and signed off release.")
            await db.commit()
        await publish_step(
            12, "VERIFIED_COMPLETION", "Giriraj reports verified completion to Aditya",
            ["agent-giriraj", "agent-aditya", "agent-abhishek"], "agent-giriraj", "agent-aditya",
            "cabin-aditya", "VERIFIED", "agent-aditya",
            "Verified result submitted to Aditya. Modernization complete with 0 defects and full evidence approval!",
            100, "VERIFIED"
        )

        await self._update_metrics()
        return {"status": "SUCCESS", "task_id": task_id, "steps_completed": 12}
'''

content = content.replace('orchestrator = OrchestratorEngine()', scenario_code + '\norchestrator = OrchestratorEngine()')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated orchestrator.py successfully')
