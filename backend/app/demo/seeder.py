"""Database Seeder with realistic multi-agent team and active demo scenarios."""
import asyncio
from datetime import datetime
from sqlalchemy import select
from app.core.db import (
    AsyncSessionLocal,
    Project,
    Agent,
    Task,
    TaskAssignment,
    Approval,
    WorkflowRun,
    VmNode,
    SystemMetric,
    AuditLog
)

AGENTS_CONFIG = [
    {"id": "agent-orchestrator", "name": "Chief Orchestrator", "role": "Chief Orchestrator / Team Leader", "parent_id": None},
    {"id": "agent-pm", "name": "Alex Mercer", "role": "Project Manager", "parent_id": "agent-orchestrator"},
    {"id": "agent-ba", "name": "Elena Rostova", "role": "Product Analyst / Business Analyst", "parent_id": "agent-orchestrator"},
    {"id": "agent-rnd", "name": "Dr. Aris Vance", "role": "Thought / R&D Engineer", "parent_id": "agent-orchestrator"},
    {"id": "agent-architect", "name": "Marcus Kane", "role": "Chief Architect", "parent_id": "agent-orchestrator"},
    {"id": "agent-senior-1", "name": "Sarah Chen", "role": "Senior Engineer 1 (Backend & Core)", "parent_id": "agent-orchestrator"},
    {"id": "agent-senior-2", "name": "David Kim", "role": "Senior Engineer 2 (Frontend & Integration)", "parent_id": "agent-orchestrator"},
    {"id": "agent-junior-1", "name": "Lucas Diaz", "role": "Junior Engineer 1 (Feature & Bugfix)", "parent_id": "agent-senior-1"},
    {"id": "agent-junior-2", "name": "Priya Patel", "role": "Junior Engineer 2 (UI & API Integration)", "parent_id": "agent-senior-2"},
    {"id": "agent-junior-3", "name": "Oliver Scott", "role": "Junior Engineer 3 (Parallel Feature & Regression)", "parent_id": "agent-senior-1"},
    {"id": "agent-dynamic-worker", "name": "Worker Pool (1-8)", "role": "Dynamic Coding Workers", "parent_id": "agent-orchestrator"},
    {"id": "agent-devops", "name": "Devin Torres", "role": "Automation / DevOps Engineer", "parent_id": "agent-orchestrator"},
    {"id": "agent-watcher", "name": "Actions Sentinel", "role": "GitHub Actions Watcher", "parent_id": "agent-devops"},
    {"id": "agent-qa", "name": "Tanya Volkova", "role": "QA / Human Simulation Engineer", "parent_id": "agent-orchestrator"},
    {"id": "agent-vm-fleet", "name": "Atlas Fleet Handler", "role": "VM Fleet / Infrastructure Handler", "parent_id": "agent-devops"},
    {"id": "agent-assembly", "name": "Gordon Vance", "role": "Review & Assembly Engineer", "parent_id": "agent-orchestrator"},
    {"id": "agent-security", "name": "Aegis Gatekeeper", "role": "Security / Release Gate", "parent_id": "agent-orchestrator"},
]

async def seed_demo_data():
    async with AsyncSessionLocal() as db:
        # Check if already seeded
        res = await db.execute(select(Agent))
        if res.scalars().first():
            return

        # 1. Projects
        proj = Project(
            id="proj-default",
            name="SuperApp E-Commerce & Auth Service",
            repo_path="D:/Projects/SuperApp_V2",
            branch="main",
            description="Multi-tier microservices platform with authentication, payment gateway, and dashboard.",
            status="ACTIVE"
        )
        db.add(proj)

        # 2. Seed 17 Agents
        for a in AGENTS_CONFIG:
            agent = Agent(
                id=a["id"],
                name=a["name"],
                role=a["role"],
                status="IDLE",
                parent_id=a["parent_id"],
                model="Gemini 1.5 Pro" if "Senior" in a["role"] or "Architect" in a["role"] or "Orchestrator" in a["role"] else "Gemini 1.5 Flash",
                tasks_completed=4,
                tasks_failed=0,
                last_activity=datetime.utcnow()
            )
            db.add(agent)

        # 3. Seed Tasks & DAG
        tasks_data = [
            {
                "id": "TASK-001",
                "title": "Design REST & WebSocket Contracts",
                "goal": "Establish OpenAPI spec and realtime websocket event protocol",
                "status": "VERIFIED",
                "priority": "HIGH",
                "assigned_agent_id": "agent-architect",
                "dependencies": [],
                "commit_sha": "f1d2e3c4b5a6",
                "acceptance_criteria": ["OpenAPI 3.1 valid spec", "JWT auth headers defined"],
                "test_command": "pytest tests/test_api_spec.py",
                "test_passed": True
            },
            {
                "id": "TASK-002",
                "title": "Implement JWT & Role Authentication",
                "goal": "Build robust auth provider with bcrypt hashing and rate-limiting",
                "status": "VERIFIED",
                "priority": "HIGH",
                "assigned_agent_id": "agent-senior-1",
                "dependencies": ["TASK-001"],
                "commit_sha": "b2c3d4e5f6a1",
                "acceptance_criteria": ["Pass all unit tests", "Bcrypt salt rounds >= 12"],
                "test_command": "pytest backend/tests/test_auth.py",
                "test_passed": True
            },
            {
                "id": "TASK-003",
                "title": "Build Customer Registration & Login UI",
                "goal": "Create accessible login/signup screens with form validation",
                "status": "VERIFIED",
                "priority": "MEDIUM",
                "assigned_agent_id": "agent-senior-2",
                "dependencies": ["TASK-001"],
                "commit_sha": "c3d4e5f6a1b2",
                "acceptance_criteria": ["Responsive on mobile & desktop", "Zod schema client validation"],
                "test_command": "npm test",
                "test_passed": True
            },
            {
                "id": "TASK-004",
                "title": "End-to-End Registration & Auth Journey",
                "goal": "Simulate real user signup, confirmation, login, and token refresh",
                "status": "VERIFIED",
                "priority": "HIGH",
                "assigned_agent_id": "agent-qa",
                "dependencies": ["TASK-002", "TASK-003"],
                "commit_sha": "d4e5f6a1b2c3",
                "acceptance_criteria": ["Playwright headless E2E verification green"],
                "test_command": "npx playwright test tests/e2e/auth.spec.ts",
                "test_passed": True
            },
            {
                "id": "TASK-005",
                "title": "Automate GitHub Actions CI Pipeline",
                "goal": "Build test and docker build workflow with action caching",
                "status": "VERIFIED",
                "priority": "MEDIUM",
                "assigned_agent_id": "agent-devops",
                "dependencies": ["TASK-004"],
                "commit_sha": "e5f6a1b2c3d4",
                "acceptance_criteria": ["GitHub Actions YAML passes lint", "Caching reduces run to < 3min"],
                "test_command": "actionlint .github/workflows/ci.yml",
                "test_passed": True
            },
            {
                "id": "TASK-006",
                "title": "Deploy Release Candidate to Staging VM",
                "goal": "Rollout v1.2.0-rc to vm-staging-01 and verify zero drift",
                "status": "VERIFIED",
                "priority": "HIGH",
                "assigned_agent_id": "agent-vm-fleet",
                "dependencies": ["TASK-005"],
                "commit_sha": "a6b7c8d9e0f1",
                "acceptance_criteria": ["Ansible playbook returns 0 changed", "Health check 200 OK"],
                "test_command": "curl -f http://vm-staging-01:8000/health",
                "test_passed": True
            },
            {
                "id": "TASK-007",
                "title": "Production Release Gate & Audit",
                "goal": "Static security scan, dependency audit, and human approval signoff",
                "status": "READY_TO_RELEASE",
                "priority": "HIGH",
                "assigned_agent_id": "agent-security",
                "dependencies": ["TASK-006"],
                "commit_sha": "a6b7c8d9e0f1",
                "acceptance_criteria": ["Zero high/critical CVEs", "Production approval received"],
                "test_command": "python scripts/security_audit.py",
                "test_passed": True
            }
        ]

        for t_info in tasks_data:
            t = Task(
                id=t_info["id"],
                project_id="proj-default",
                title=t_info["title"],
                goal=t_info["goal"],
                status=t_info["status"],
                priority=t_info["priority"],
                assigned_agent_id=t_info["assigned_agent_id"],
                assigned_by_agent_id="agent-orchestrator",
                commit_sha=t_info.get("commit_sha"),
                dependencies_json=str(t_info["dependencies"]).replace("'", '"'),
                acceptance_criteria_json=str(t_info["acceptance_criteria"]).replace("'", '"'),
                test_command=t_info["test_command"],
                test_passed=t_info["test_passed"],
                retries=0
            )
            db.add(t)

        # 4. Seed Task Assignments (WHO assigns WHAT to WHOM)
        assignments = [
            ("TASK-001", "agent-orchestrator", "agent-architect", "Assign architectural spec definition"),
            ("TASK-002", "agent-orchestrator", "agent-senior-1", "Assign backend core implementation"),
            ("TASK-003", "agent-orchestrator", "agent-senior-2", "Assign frontend integration"),
            ("TASK-004", "agent-orchestrator", "agent-qa", "Assign QA journey simulation"),
            ("TASK-005", "agent-orchestrator", "agent-devops", "Assign CI/CD pipeline automation"),
            ("TASK-006", "agent-orchestrator", "agent-vm-fleet", "Assign staging VM deployment"),
            ("TASK-007", "agent-orchestrator", "agent-security", "Assign release gate verification"),
        ]
        for task_id, from_a, to_a, rat in assignments:
            asgn = TaskAssignment(
                task_id=task_id,
                from_agent_id=from_a,
                to_agent_id=to_a,
                status="COMPLETED" if task_id != "TASK-007" else "ASSIGNED",
                rationale=rat,
                assigned_at=datetime.utcnow()
            )
            db.add(asgn)

        # 5. Seed Human Approval Request
        appr = Approval(
            id="APP-TASK-007",
            project_id="proj-default",
            action_type="PRODUCTION_DEPLOYMENT",
            title="Production Release v1.2.0 - Core Auth & Payment Gateway",
            commit_sha="a6b7c8d9e0f1",
            risk_summary="High impact production rollout affecting 50k active users. Includes DB migration for user sessions.",
            test_evidence="15 Unit Tests passed, 8 E2E journeys verified, Staging smoke tests 200 OK, 0 CVEs found.",
            rollback_plan="Immediate rollback to image digest sha256:7f83b16 (v1.1.9) via automated ansible script in < 45 seconds.",
            status="PENDING"
        )
        db.add(appr)

        # 6. Seed VM Fleet
        vm_nodes = [
            VmNode(id="vm-stage-01", alias="staging-api-primary", environment="staging", host="10.0.1.15", role="api", current_version="v1.2.0-rc", target_version="v1.2.0-rc", status="HEALTHY", is_simulated=True),
            VmNode(id="vm-stage-02", alias="staging-worker-01", environment="staging", host="10.0.1.16", role="worker", current_version="v1.2.0-rc", target_version="v1.2.0-rc", status="HEALTHY", is_simulated=True),
            VmNode(id="vm-prod-01", alias="prod-api-eu-central", environment="production", host="10.0.2.20", role="api", current_version="v1.1.9", target_version="v1.2.0", status="HEALTHY", is_simulated=True),
            VmNode(id="vm-prod-02", alias="prod-api-us-east", environment="production", host="10.0.2.21", role="api", current_version="v1.1.9", target_version="v1.2.0", status="HEALTHY", is_simulated=True),
            VmNode(id="vm-prod-03", alias="prod-db-replica-01", environment="production", host="10.0.2.35", role="database", current_version="v1.1.9", target_version="v1.2.0", status="DRIFT_DETECTED", drift_details="Config drift: max_connections=250 vs expected 500", is_simulated=True),
        ]
        for node in vm_nodes:
            db.add(node)

        # 7. Seed GitHub Workflow Runs
        wf_runs = [
            WorkflowRun(id="run-101", repo="SuperApp_V2", branch="main", commit_sha="a6b7c8d9e0f1", workflow_name="CI Test & Build", status="completed", conclusion="success", linked_task_id="TASK-005", simulated=True),
            WorkflowRun(id="run-102", repo="SuperApp_V2", branch="feat/payment", commit_sha="3f8b1c4e9d0a", workflow_name="Integration E2E", status="completed", conclusion="failure", failed_step="Run Playwright E2E", failure_category="CODE_ERROR", linked_task_id="TASK-004", log_excerpt="AssertionError: Expected payment status APPROVED, received TIMEOUT", simulated=True),
            WorkflowRun(id="run-103", repo="SuperApp_V2", branch="feat/cart", commit_sha="7e2d9a1c4b8f", workflow_name="Lint & Security", status="completed", conclusion="success", simulated=True)
        ]
        for r in wf_runs:
            db.add(r)

        # 8. Seed Initial Metrics
        metrics = SystemMetric(
            active_workers=2,
            queue_length=1,
            running_tests=0,
            ci_failures=1,
            active_deployments=0,
            healthy_vms=4,
            verified_criteria_percent=85.7,
            kill_switch_active=False
        )
        db.add(metrics)

        # 9. Seed Audit Logs
        logs = [
            ("PROJECT_INITIALIZED", "CHIEF_ORCHESTRATOR", "SuperApp E-Commerce & Auth Service project workspace discovered."),
            ("PLAN_CREATED", "CHIEF_ORCHESTRATOR", "Deconstructed user request into 7 DAG tasks."),
            ("TASK_ASSIGNED", "CHIEF_ORCHESTRATOR", "Assigned TASK-001 to Chief Architect."),
            ("TASK_VERIFIED", "CHIEF_ORCHESTRATOR", "TASK-001 verified with valid schema artifacts."),
            ("TASK_ASSIGNED", "CHIEF_ORCHESTRATOR", "Assigned TASK-002 to Senior Engineer 1."),
            ("TASK_VERIFIED", "CHIEF_ORCHESTRATOR", "TASK-002 verified with 15 passing tests."),
            ("STAGING_DEPLOYED", "VM_FLEET_HANDLER", "Deployed v1.2.0-rc to vm-stage-01 and verified health."),
            ("APPROVAL_REQUESTED", "SECURITY_RELEASE_GATE", "Human approval requested for Production Release v1.2.0.")
        ]
        for evt, actor, det in logs:
            db.add(AuditLog(event_type=evt, actor=actor, details=det))

        await db.commit()
