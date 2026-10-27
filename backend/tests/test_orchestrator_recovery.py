"""Tests for Orchestrator crash and restart recovery."""
import pytest
from app.core.db import AsyncSessionLocal, Task
from app.core.orchestrator import orchestrator
from app.core.state_machine import TaskState

@pytest.mark.asyncio
async def test_recover_interrupted_tasks():
    # Insert a task that was left IN_PROGRESS when the orchestrator crashed
    async with AsyncSessionLocal() as db:
        interrupted = Task(
            id="TASK-888",
            project_id="proj-default",
            title="Database Sharding Migration",
            goal="Partition user tables",
            status=TaskState.IN_PROGRESS.value
        )
        db.add(interrupted)
        await db.commit()

    # Trigger restart recovery routine
    await orchestrator.recover_from_crash()

    # Verify task safely recovered back to READY for worker re-acquisition
    async with AsyncSessionLocal() as db:
        t = await db.get(Task, "TASK-888")
        assert t.status == TaskState.READY.value
