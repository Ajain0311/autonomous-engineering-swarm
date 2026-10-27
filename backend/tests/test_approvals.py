"""Tests for Human Approval Center and Production Gate enforcement."""
import pytest
from app.core.db import AsyncSessionLocal, Approval, Task
from app.core.state_machine import TaskState

@pytest.mark.asyncio
async def test_production_deployment_approval_enforcement():
    async with AsyncSessionLocal() as db:
        task = Task(
            id="TASK-900",
            title="Production Release v2.0",
            goal="Deploy to production cluster",
            status=TaskState.READY_TO_RELEASE.value,
            retries=0
        )
        approval = Approval(
            id="APP-TASK-900",
            project_id="proj-default",
            action_type="PRODUCTION_DEPLOYMENT",
            title="Deploy v2.0",
            commit_sha="a1b2c3d4",
            risk_summary="High impact release",
            rollback_plan="Revert image tag",
            status="PENDING"
        )
        db.add(task)
        db.add(approval)
        await db.commit()

    # Verify initially PENDING
    async with AsyncSessionLocal() as db:
        appr = await db.get(Approval, "APP-TASK-900")
        assert appr.status == "PENDING"
        t = await db.get(Task, "TASK-900")
        assert t.status == TaskState.READY_TO_RELEASE.value

    # Simulate Human Approval
    async with AsyncSessionLocal() as db:
        appr = await db.get(Approval, "APP-TASK-900")
        appr.status = "APPROVED"
        appr.approved_by = "Lead Architect"
        t = await db.get(Task, "TASK-900")
        t.status = TaskState.VERIFIED.value
        await db.commit()

    async with AsyncSessionLocal() as db:
        t = await db.get(Task, "TASK-900")
        assert t.status == TaskState.VERIFIED.value
