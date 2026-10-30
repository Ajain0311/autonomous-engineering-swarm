"""Database Seeder with realistic 18-agent multi-agent team and active modernization scenarios."""
import asyncio
from datetime import datetime, timezone
import json
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
    AuditLog,
    BaDiscussion,
    RdSuggestion,
    UiUxDesignSpec,
    LegacyRegressionCheck
)

AGENTS_CONFIG = [
    {"id": "agent-aditya", "name": "Aditya Jain", "role": "Chief Orchestrator / Top Authority", "parent_id": None},
    {"id": "agent-sanjay", "name": "Sanjay Sahlot", "role": "Operations Coordinator / Deputy Lead", "parent_id": "agent-aditya"},
    {"id": "agent-giriraj", "name": "Giriraj Mali", "role": "Senior Developer / Engineering Lead", "parent_id": "agent-aditya"},
    {"id": "agent-bhupendra", "name": "Bhupendra Jingar", "role": "Business Analyst / Product Analyst", "parent_id": "agent-aditya"},
    {"id": "agent-abhishek", "name": "Abhishek Hingar", "role": "QA Lead", "parent_id": "agent-giriraj"},
    {"id": "agent-ashish", "name": "Ashish Das", "role": "Tester, reporting to QA", "parent_id": "agent-abhishek"},
    {"id": "agent-rohan", "name": "Rohan Sharma", "role": "Developer", "parent_id": "agent-giriraj"},
    {"id": "agent-shaurya", "name": "Shaurya Jain", "role": "Developer", "parent_id": "agent-giriraj"},
    {"id": "agent-binod", "name": "Binod Kumar", "role": "Developer", "parent_id": "agent-giriraj"},
    {"id": "agent-mohit", "name": "Mohit Sharma", "role": "Developer", "parent_id": "agent-giriraj"},
    {"id": "agent-harshit-p", "name": "Harshit Purohit", "role": "DevOps Engineer", "parent_id": "agent-sanjay"},
    {"id": "agent-divisha", "name": "Divisha Joshi", "role": "Documentation Engineer", "parent_id": "agent-giriraj"},
    {"id": "agent-hemang", "name": "Hemang Tiwari", "role": "Code Review Engineer", "parent_id": "agent-giriraj"},
    {"id": "agent-esha", "name": "Esha Saini", "role": "UI/UX Designer / UI/UX Design Engineer", "parent_id": "agent-giriraj"},
    {"id": "agent-kratik", "name": "Kratik Jain", "role": "Backend Engineer", "parent_id": "agent-giriraj"},
    {"id": "agent-maan", "name": "Maan Singh", "role": "Frontend Engineer", "parent_id": "agent-giriraj"},
    {"id": "agent-harshit-m", "name": "Harshit Masta", "role": "Security Engineer", "parent_id": "agent-aditya"},
    {"id": "agent-kathan", "name": "Himanshu Lala", "role": "Automation / CI Engineer", "parent_id": "agent-harshit-p"},
]

async def seed_demo_data(force_refresh_agents: bool = False):
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(Agent))
        existing_agents = res.scalars().all()
        has_aditya = any(a.name == "Aditya Jain" for a in existing_agents)

        now = datetime.now(timezone.utc)

        # 1. Ensure 18 Official Employees
        if not existing_agents or not has_aditya or force_refresh_agents:
            if existing_agents:
                for a in existing_agents:
                    await db.delete(a)
                await db.commit()

            for a in AGENTS_CONFIG:
                agent = Agent(
                    id=a["id"],
                    name=a["name"],
                    role=a["role"],
                    status="IDLE",
                    parent_id=a["parent_id"],
                    model="Gemini 1.5 Pro" if "Chief" in a["role"] or "Senior" in a["role"] or "Lead" in a["role"] or "Review" in a["role"] or "Security" in a["role"] or "Business" in a["role"] else "Gemini 1.5 Flash",
                    tasks_completed=4,
                    tasks_failed=0,
                    last_activity=now
                )
                db.add(agent)
            await db.commit()

        # Check if other models already seeded
        proj_res = await db.execute(select(Project))
        if proj_res.scalars().first():
            return

        # 2. Projects
        proj = Project(
            id="proj-default",
            name="SuperApp E-Commerce & Auth Service",
            repo_path="D:/Projects/SuperApp_V2",
            branch="main",
            description="Multi-tier microservices platform with authentication, payment gateway, and dashboard.",
            status="ACTIVE",
            created_at=now
        )
        db.add(proj)

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
                "goal": "Create accessible login/signup screens with form validation and touch ergonomics",
                "status": "VERIFIED",
                "priority": "MEDIUM",
                "assigned_agent_id": "agent-uiux",
                "dependencies": ["TASK-001"],
                "commit_sha": "c3d4e5f6a1b2",
                "acceptance_criteria": ["Google clarity + Rapido speed compliance", "Zod schema client validation"],
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
                retries=0,
                created_at=now,
                updated_at=now
            )
            db.add(t)

        # 4. Seed Task Assignments
        assignments = [
            ("TASK-001", "agent-orchestrator", "agent-architect", "Assign architectural spec definition"),
            ("TASK-002", "agent-orchestrator", "agent-senior-1", "Assign backend core implementation"),
            ("TASK-003", "agent-orchestrator", "agent-uiux", "Assign UI/UX interaction design & frontend screens"),
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
                assigned_at=now
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
            status="PENDING",
            created_at=now
        )
        db.add(appr)

        # 6. Seed VM Fleet
        vm_nodes = [
            VmNode(id="vm-stage-01", alias="staging-api-primary", environment="staging", host="10.0.1.15", role="api", current_version="v1.2.0-rc", target_version="v1.2.0-rc", status="HEALTHY", is_simulated=True, last_sync_at=now),
            VmNode(id="vm-stage-02", alias="staging-worker-01", environment="staging", host="10.0.1.16", role="worker", current_version="v1.2.0-rc", target_version="v1.2.0-rc", status="HEALTHY", is_simulated=True, last_sync_at=now),
            VmNode(id="vm-prod-01", alias="prod-api-eu-central", environment="production", host="10.0.2.20", role="api", current_version="v1.1.9", target_version="v1.2.0", status="HEALTHY", is_simulated=True, last_sync_at=now),
            VmNode(id="vm-prod-02", alias="prod-api-us-east", environment="production", host="10.0.2.21", role="api", current_version="v1.1.9", target_version="v1.2.0", status="HEALTHY", is_simulated=True, last_sync_at=now),
            VmNode(id="vm-prod-03", alias="prod-db-replica-01", environment="production", host="10.0.2.35", role="database", current_version="v1.1.9", target_version="v1.2.0", status="DRIFT_DETECTED", drift_details="Config drift: max_connections=250 vs expected 500", is_simulated=True, last_sync_at=now),
        ]
        for node in vm_nodes:
            db.add(node)

        # 7. Seed GitHub Workflow Runs
        wf_runs = [
            WorkflowRun(id="run-101", repo="SuperApp_V2", branch="main", commit_sha="a6b7c8d9e0f1", workflow_name="CI Test & Build", status="completed", conclusion="success", linked_task_id="TASK-005", simulated=True, created_at=now),
            WorkflowRun(id="run-102", repo="SuperApp_V2", branch="feat/payment", commit_sha="3f8b1c4e9d0a", workflow_name="Integration E2E", status="completed", conclusion="failure", failed_step="Run Playwright E2E", failure_category="CODE_ERROR", linked_task_id="TASK-004", log_excerpt="AssertionError: Expected payment status APPROVED, received TIMEOUT", simulated=True, created_at=now),
            WorkflowRun(id="run-103", repo="SuperApp_V2", branch="feat/cart", commit_sha="7e2d9a1c4b8f", workflow_name="Lint & Security", status="completed", conclusion="success", simulated=True, created_at=now)
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
            kill_switch_active=False,
            updated_at=now
        )
        db.add(metrics)

        # ----------------- SEED MODERNIZATION SCENARIOS ----------------- #

        # 9. Seed Business Analyst (BA) Requirement Discussion
        ba_disc = BaDiscussion(
            id="BA-001",
            project_id="proj-default",
            feature_name="Customer Loyalty Rewards & Coupon Redemption Tab",
            user_problem="Customers drop off during checkout because there is no intuitive way to view, scratch, and apply earned discount coupons on mobile.",
            proposed_flow="Checkout screen ➔ Click 'Apply Coupon' ➔ Quick slide-up modal showing available loyalty rewards ➔ Single-tap apply with instant cart recalculation.",
            questions_json=json.dumps([
                {
                    "id": "Q1",
                    "topic": "Coupon Expiration Grace Period",
                    "question": "Should coupons expiring within 24 hours remain redeemable during an active checkout session?",
                    "recommended_default": "Yes - 30 minute lock during active session",
                    "rationale": "Prevents cart abandonment when a coupon expires mid-checkout while customer enters card details.",
                    "user_answer": "Yes - 30 minute lock during active session",
                    "is_answered": True
                },
                {
                    "id": "Q2",
                    "topic": "Partial Discount Stacking",
                    "question": "Are loyalty reward points stackable with seasonal promotional coupon codes?",
                    "recommended_default": "No - Highest single discount takes precedence",
                    "rationale": "Protects gross profit margin and avoids negative cart totals.",
                    "user_answer": "No - Highest single discount takes precedence",
                    "is_answered": True
                }
            ]),
            acceptance_criteria_json=json.dumps([
                "Loyalty Rewards tab visible in Navigation bar for authenticated Customers",
                "Hidden from Anonymous users with redirect to login",
                "Coupon redemption enforces single-use token in database",
                "Touch targets for mobile coupon cards >= 48px"
            ]),
            status="CONFIRMED",
            confirmed_by="Aditya Jain",
            confirmed_at=now,
            created_at=now
        )
        db.add(ba_disc)

        # 10. Seed Thought / R&D Technical Suggestions (Essential vs Optional)
        rd_suggs = [
            RdSuggestion(
                id="RD-001",
                project_id="proj-default",
                feature_name="Customer Loyalty Rewards & Coupon Redemption Tab",
                title="Distributed Redis Redlock for Idempotent Coupon Claims",
                category="ESSENTIAL",
                benefit="Prevents race conditions where a fast user redeems the same coupon across 2 browser tabs simultaneously.",
                risk_tradeoff="Requires Redis dependency, but prevents financial leakage.",
                complexity="MEDIUM",
                status="APPROVED",
                decided_at=now,
                created_at=now
            ),
            RdSuggestion(
                id="RD-002",
                project_id="proj-default",
                feature_name="Customer Loyalty Rewards & Coupon Redemption Tab",
                title="Micro-Haptic Confetti Celebration on Successful Redemption",
                category="OPTIONAL",
                benefit="Delights mobile users and reinforces rewarding checkout experience (Rapido-inspired delight).",
                risk_tradeoff="Minor JS bundle addition (12kb canvas-confetti).",
                complexity="LOW",
                status="APPROVED",
                decided_at=now,
                created_at=now
            )
        ]
        for rd in rd_suggs:
            db.add(rd)

        # 11. Seed UI/UX Design Specification
        uiux_spec = UiUxDesignSpec(
            id="UIUX-001",
            project_id="proj-default",
            screen_name="Loyalty Rewards & Voucher Drawer",
            menu_path="/dashboard/rewards",
            allowed_roles_json=json.dumps(["Customer", "Admin"]),
            states_matrix_json=json.dumps({
                "loading": "Skeleton card grid matching 3 voucher slots with subtle shimmer.",
                "empty": "Illustration of gift box: 'No coupons available right now. Place an order to earn reward points!'",
                "success": "Voucher applied! Green badge with '-$15.00' reflected instantly on cart subtotal.",
                "error": "Banner: 'Coupon code INVALID_SAVE20 has already been used. Please try another.'",
                "forbidden": "403 lock screen: 'Loyalty rewards require an active customer membership account.'"
            }),
            design_tokens_json=json.dumps({
                "primary_action_height": "48px",
                "border_radius": "12px",
                "contrast_ratio": "7.2:1 (AAA)",
                "font_family": "Inter, system-ui, sans-serif"
            }),
            status="VERIFIED",
            created_at=now
        )
        db.add(uiux_spec)

        # 12. Seed Legacy Regression Check
        legacy_check = LegacyRegressionCheck(
            id="LEG-001",
            project_id="proj-default",
            controller_name="CheckoutController.cs",
            file_path="SuperApp_V2/Controllers/CheckoutController.cs",
            routes_json=json.dumps([
                "POST /api/checkout/cart",
                "POST /api/checkout/apply-coupon",
                "POST /api/checkout/process-payment",
                "GET /api/checkout/summary"
            ]),
            has_business_logic=True,
            refactoring_status="EXTRACTED_TO_SERVICE",
            baseline_test_suite="SuperApp_V2.Tests/Regression/CheckoutRegressionTests.cs (12 Tests)",
            regression_test_status="PASSING",
            extracted_service="Services/Checkout/CheckoutService.cs (Controller reduced from 420 LOC to 68 LOC)",
            created_at=now,
            updated_at=now
        )
        db.add(legacy_check)

        # 13. Audit Logs
        logs = [
            ("PROJECT_INITIALIZED", "CHIEF_ORCHESTRATOR", "SuperApp E-Commerce & Auth Service project workspace discovered."),
            ("PLAN_CREATED", "CHIEF_ORCHESTRATOR", "Deconstructed user request into DAG tasks."),
            ("BA_DISCUSSION_STARTED", "PRODUCT_ANALYST", "Initiated requirements discussion for Loyalty Rewards with recommended defaults."),
            ("BA_REQUIREMENTS_CONFIRMED", "OPERATOR", "Aditya Jain confirmed material requirements for BA-001."),
            ("RD_SUGGESTION_APPROVED", "THOUGHT_RND_ENGINEER", "Approved Redis Redlock recommendation for atomic redemption."),
            ("UIUX_SPEC_VERIFIED", "UIUX_DESIGN_ENGINEER", "Validated 5-state matrix and 48px touch targets for rewards screen."),
            ("LEGACY_REGRESSION_VERIFIED", "CHIEF_ARCHITECT", "Extracted CheckoutController business logic into CheckoutService with 12 passing regression tests."),
            ("APPROVAL_REQUESTED", "SECURITY_RELEASE_GATE", "Human approval requested for Production Release v1.2.0.")
        ]
        for evt, actor, det in logs:
            db.add(AuditLog(event_type=evt, actor=actor, details=det, timestamp=now))

        await db.commit()
