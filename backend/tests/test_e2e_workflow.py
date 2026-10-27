"""End-to-End multi-agent execution, defect generation, retry, and verification."""
import pytest
import asyncio
from app.core.db import AsyncSessionLocal, Task
from app.core.orchestrator import orchestrator
from app.core.state_machine import TaskState

@pytest.mark.asyncio
async def test_e2e_worker_execution_and_verification():
    task_id = "TASK-501"
    async with AsyncSessionLocal() as db:
        t = Task(
            id=task_id,
            project_id="proj-default",
            title="User Profile Management API",
            goal="Add profile picture upload and validation",
            status=TaskState.READY.value,
            dependencies_json="[]",
            acceptance_criteria_json='["Validate image dimensions", "Persist metadata"]',
            allowed_files_json='["backend/src/**"]',
            retries=0,
            max_retries=3
        )
        db.add(t)
        await db.commit()

    # 1. Run pipeline - first with simulated failure
    await orchestrator.execute_task_pipeline(task_id, force_test_failure=True)

    async with AsyncSessionLocal() as db:
        t = await db.get(Task, task_id)
        # Should have routed back to IN_PROGRESS for retry attempt 1
        assert t.retries == 1
        assert t.status == TaskState.IN_PROGRESS.value

    # 2. Worker executes fix and succeeds
    await orchestrator.execute_task_pipeline(task_id, force_test_failure=False)

    async with AsyncSessionLocal() as db:
        t = await db.get(Task, task_id)
        # Should now be VERIFIED with commit SHA
        assert t.status == TaskState.VERIFIED.value
        assert t.commit_sha is not None
        assert t.test_passed is True
