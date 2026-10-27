import re

path = 'backend/app/demo/seeder.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make seed_demo_data safe against duplicate primary keys:
safe_seed = '''async def seed_demo_data(force_refresh_agents: bool = False):
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
        db.add(proj)'''

# Replace from 'async def seed_demo_data' up to '# 3. Seed Tasks & DAG'
content = re.sub(
    r'async def seed_demo_data.*?# 3\. Seed Tasks & DAG',
    safe_seed + '\n\n        # 3. Seed Tasks & DAG',
    content,
    flags=re.DOTALL
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated seed_demo_data successfully')
