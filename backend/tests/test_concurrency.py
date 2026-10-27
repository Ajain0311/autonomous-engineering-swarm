"""Tests enforcing the strict 8-worker concurrency ceiling."""
import pytest
import asyncio
from app.core.orchestrator import OrchestratorEngine

@pytest.mark.asyncio
async def test_maximum_eight_concurrent_workers():
    engine = OrchestratorEngine()
    assert engine.max_workers == 8

    # Simulate dispatching 20 tasks concurrently
    peak_concurrency = 0
    current_concurrency = 0
    lock = asyncio.Lock()

    async def worker_job():
        nonlocal peak_concurrency, current_concurrency
        async with engine._worker_semaphore:
            async with lock:
                current_concurrency += 1
                if current_concurrency > peak_concurrency:
                    peak_concurrency = current_concurrency
            
            # Simulate work
            await asyncio.sleep(0.05)

            async with lock:
                current_concurrency -= 1

    tasks = [asyncio.create_task(worker_job()) for _ in range(25)]
    await asyncio.gather(*tasks)

    # Concurrency must strictly never exceed 8
    assert peak_concurrency <= 8
    assert peak_concurrency > 0
