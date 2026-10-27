"""Automated verification tests for Living 3D Office:
- 18 Employee Hierarchy & Exact Character Mapping
- Reporting Routes & Task Assignment Traversal
- End-to-End 12-Step Task Lifecycle Scenario Execution
"""
import pytest
import asyncio
from app.demo.seeder import AGENTS_CONFIG, seed_demo_data
from app.core.db import AsyncSessionLocal, Agent, Task, TaskAssignment, AuditLog
from app.core.orchestrator import orchestrator
from app.core.event_bus import event_bus
from app.core.state_machine import TaskState

EXPECTED_EMPLOYEES = [
    ("agent-aditya", "Aditya Jain", "Chief Orchestrator / Top Authority", None),
    ("agent-sanjay", "Sanjay Sahlot", "Operations Coordinator / Deputy Lead", "agent-aditya"),
    ("agent-giriraj", "Giriraj Mali", "Senior Developer / Engineering Lead", "agent-aditya"),
    ("agent-bhupendra", "Bhupendra Jingar", "Business Analyst / Product Analyst", "agent-aditya"),
    ("agent-abhishek", "Abhishek Hingar", "QA Lead", "agent-giriraj"),
    ("agent-ashish", "Ashish Das", "Tester, reporting to QA", "agent-abhishek"),
    ("agent-rohan", "Rohan Sharma", "Developer", "agent-giriraj"),
    ("agent-shaurya", "Shaurya Jain", "Developer", "agent-giriraj"),
    ("agent-binod", "Binod Kumar", "Developer", "agent-giriraj"),
    ("agent-mohit", "Mohit Sharma", "Developer", "agent-giriraj"),
    ("agent-harshit-p", "Harshit Purohit", "DevOps Engineer", "agent-sanjay"),
    ("agent-divisha", "Divisha Joshi", "Documentation Engineer", "agent-giriraj"),
    ("agent-hemang", "Hemang Tiwari", "Code Review Engineer", "agent-giriraj"),
    ("agent-esha", "Esha Saini", "UI/UX Designer / UI/UX Design Engineer", "agent-giriraj"),
    ("agent-kratik", "Kratik Jain", "Backend Engineer", "agent-giriraj"),
    ("agent-maan", "Maan Singh", "Frontend Engineer", "agent-giriraj"),
    ("agent-harshit-m", "Harshit Masta", "Security Engineer", "agent-aditya"),
    ("agent-kathan", "Kathan Jain", "Automation / CI Engineer", "agent-harshit-p"),
]

def test_exact_eighteen_employees_in_config():
    """Verify all 18 employees in AGENTS_CONFIG have exact names and reporting hierarchy."""
    assert len(AGENTS_CONFIG) == 18
    config_dict = {a["id"]: a for a in AGENTS_CONFIG}

    for emp_id, emp_name, emp_role_substr, parent_id in EXPECTED_EMPLOYEES:
        assert emp_id in config_dict, f"Missing employee ID {emp_id}"
        agent = config_dict[emp_id]
        assert agent["name"] == emp_name, f"Expected {emp_name}, got {agent['name']}"
        assert emp_role_substr.split("/")[0].strip() in agent["role"], f"Role mismatch for {emp_name}"
        assert agent["parent_id"] == parent_id, f"Parent ID mismatch for {emp_name}"

@pytest.mark.asyncio
async def test_database_seeded_with_eighteen_employees():
    """Ensure database has the exact 18 employees persisted."""
    await seed_demo_data(force_refresh_agents=True)
    async with AsyncSessionLocal() as db:
        res = await db.execute(Agent.__table__.select())
        agents = res.fetchall()
        assert len(agents) == 18
        names = {a.name for a in agents}
        for _, name, _, _ in EXPECTED_EMPLOYEES:
            assert name in names, f"{name} not found in database agents table"

def test_task_to_character_mapping():
    """Verify tasks are assigned to the correct specialized employee and supervisor."""
    t_dev = Task(id="TASK-T1", title="Implement High-Speed Cache", goal="Perf")
    role, agent_id, sup_id = orchestrator._resolve_worker_agent(t_dev)
    assert agent_id == "agent-rohan"
    assert sup_id == "agent-giriraj"

    t_ui = Task(id="TASK-T2", title="Design Screen Mockups for Checkout", goal="UI/UX")
    role, agent_id, sup_id = orchestrator._resolve_worker_agent(t_ui)
    assert agent_id == "agent-esha"
    assert "UI/UX" in role

    t_qa = Task(id="TASK-T3", title="Run QA test suite", goal="QA")
    role, agent_id, sup_id = orchestrator._resolve_worker_agent(t_qa)
    assert agent_id == "agent-ashish"
    assert sup_id == "agent-abhishek"

    t_devops = Task(id="TASK-T4", title="Deploy VM infrastructure", goal="DevOps")
    role, agent_id, sup_id = orchestrator._resolve_worker_agent(t_devops)
    assert agent_id == "agent-harshit-p"
    assert sup_id == "agent-sanjay"

@pytest.mark.asyncio
async def test_full_twelve_step_office_lifecycle_scenario():
    """Verify execution of the 12-step Living 3D Office task lifecycle with event capture."""
    captured_steps = []

    def on_event(msg):
        if msg.get("type") == "OFFICE_LIFECYCLE_STEP":
            captured_steps.append(msg["data"])

    event_bus.subscribe(on_event)

    result = await orchestrator.run_office_lifecycle_scenario(step_delay=0.01)
    assert result["status"] == "SUCCESS"
    assert result["steps_completed"] == 12

    # Verify captured WebSocket event steps
    assert len(captured_steps) == 12
    step_numbers = [s["step_number"] for s in captured_steps]
    assert step_numbers == list(range(1, 13))

    # Check Step 1: Aditya calls Giriraj
    assert captured_steps[0]["primary_agent_id"] == "agent-aditya"
    assert captured_steps[0]["target_agent_id"] == "agent-giriraj"

    # Check Step 4: Rohan coding at desk
    assert captured_steps[3]["primary_agent_id"] == "agent-rohan"
    assert captured_steps[3]["action"] == "CODE"

    # Check Step 6: Rohan presenting work to Giriraj
    assert captured_steps[5]["action"] == "PRESENT"
    assert "Implementation complete" in captured_steps[5]["speech"]["text"]

    # Check Step 9: Defect remediated
    assert captured_steps[8]["defect_detected"] is True

    # Check Step 12: Giriraj reports verified completion to Aditya
    assert captured_steps[11]["action"] == "VERIFIED"
    assert captured_steps[11]["status"] == "VERIFIED"

    # Verify SQLite Task state
    async with AsyncSessionLocal() as db:
        t = await db.get(Task, "TASK-LIFECYCLE-100")
        assert t is not None
        assert t.status == TaskState.VERIFIED.value
        assert t.commit_sha == "c7d8e9f0a1b2"
        assert t.retries == 1
        assert t.test_passed is True
