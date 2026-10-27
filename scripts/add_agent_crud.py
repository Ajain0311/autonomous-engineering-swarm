path = 'backend/app/api/routers.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add CreateAgentPayload & UpdateAgentPayload near top DTOs
dtos = '''class CreateAgentPayload(BaseModel):
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
'''

content = content.replace('class KillSwitchPayload(BaseModel):\n    active: bool\n', 'class KillSwitchPayload(BaseModel):\n    active: bool\n\n' + dtos)
content = content.replace('class KillSwitchPayload(BaseModel):\r\n    active: bool\r\n', 'class KillSwitchPayload(BaseModel):\r\n    active: bool\r\n\r\n' + dtos)

# Add POST, PUT, DELETE after GET /agents
crud_endpoints = '''
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
'''

content = content.replace(
    '        for a in agents\n    ]\n',
    '        for a in agents\n    ]\n' + crud_endpoints
)
content = content.replace(
    '        for a in agents\r\n    ]\r\n',
    '        for a in agents\r\n    ]\r\n' + crud_endpoints
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Added agent CRUD endpoints to routers.py')
