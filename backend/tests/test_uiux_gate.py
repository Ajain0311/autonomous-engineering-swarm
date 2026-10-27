"""Tests for UI/UX Design Engineer and 5-State Matrix Quality Gate."""
import pytest
import json
from app.demo.seeder import AGENTS_CONFIG
from app.core.db import AsyncSessionLocal, UiUxDesignSpec
from app.core.orchestrator import orchestrator
from app.core.db import Task

def test_eighteen_agent_organization():
    assert len(AGENTS_CONFIG) == 18
    roles = [a["role"] for a in AGENTS_CONFIG]
    assert any("UI/UX Design Engineer" in r for r in roles)
    assert any("Product Analyst" in r for r in roles)
    assert any("Chief Orchestrator" in r for r in roles)

def test_orchestrator_routes_uiux_task():
    task = Task(id="TASK-UX-1", title="Design Mobile Checkout Screen", goal="UX layout")
    role = orchestrator._resolve_worker_role(task)
    assert "UI/UX Design Engineer" in role

@pytest.mark.asyncio
async def test_uiux_state_matrix_validation():
    # Valid spec with all 5 mandatory states
    valid_states = {
        "loading": "Skeleton grid",
        "empty": "No items illustration and CTA",
        "success": "Toast notification",
        "error": "Error banner with retry",
        "forbidden": "403 access denied message"
    }

    async with AsyncSessionLocal() as db:
        spec = UiUxDesignSpec(
            id="UIUX-TEST-001",
            project_id="proj-default",
            screen_name="Voucher Drawer",
            menu_path="/vouchers",
            allowed_roles_json='["Customer"]',
            states_matrix_json=json.dumps(valid_states),
            design_tokens_json='{"min_touch_target": "48px"}',
            status="VERIFIED"
        )
        db.add(spec)
        await db.commit()

    async with AsyncSessionLocal() as db:
        s = await db.get(UiUxDesignSpec, "UIUX-TEST-001")
        assert s.status == "VERIFIED"
        matrix = s.states_matrix
        # Check all 5 states present
        for required_state in ["loading", "empty", "success", "error", "forbidden"]:
            assert required_state in matrix
            assert len(matrix[required_state]) > 0
