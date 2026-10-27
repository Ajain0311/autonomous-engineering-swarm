path = 'backend/app/api/routers.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

endpoints_code = '''
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
'''

if "/office/lifecycle-scenario" not in content:
    content += endpoints_code
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added office endpoints to routers.py")
else:
    print("Office endpoints already present")
