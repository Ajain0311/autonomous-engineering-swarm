"""Pytest configuration and test database fixtures."""
import os
import pytest
import pytest_asyncio
import asyncio

# Set test environment
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["SIMULATION_MODE"] = "True"
os.environ["MAX_CONCURRENT_CODING_WORKERS"] = "8"
os.environ["GITHUB_WEBHOOK_SECRET"] = "test_webhook_secret_123"

from app.core.db import engine, Base

@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
