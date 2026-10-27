"""Tests for defect recovery, 3-attempt retry budget, and dead-letter queue."""
import pytest
from app.core.db import AsyncSessionLocal, Task
from app.core.orchestrator import orchestrator
from app.core.state_machine import TaskState

@pytest.mark.asyncio
async def test_retry_budget_and_dead_letter():
    task_id = "TASK-777"
    async with AsyncSessionLocal() as db:
        t = Task(
            id=task_id,
            project_id="proj-default",
            title="Complex Algorithm Task",
            goal="Process transactions",
            status=TaskState.IN_PROGRESS.value,
            retries=0,
            max_retries=3
        )
        db.add(t)
        await db.commit()

    # Simulate 3 failed attempts
    for attempt in range(1, 4):
        await orchestrator._handle_defect(task_id, evidence=None)
        async with AsyncSessionLocal() as db:
            res = await db.get(Task, task_id)
            assert res.retries == attempt
            assert res.status == TaskState.IN_PROGRESS.value

    # 4th failure must exhaust budget -> DEAD LETTER FAILED
    await orchestrator._handle_defect(task_id, evidence=None)
    async with AsyncSessionLocal() as db:
        res = await db.get(Task, task_id)
        assert res.status == TaskState.FAILED.value
        assert "Exceeded maximum defect retry budget" in res.error_message
