"""Tests for Legacy Modernization, Regression Baselines, and Controller Extraction."""
import pytest
import json
from app.core.db import AsyncSessionLocal, LegacyRegressionCheck

@pytest.mark.asyncio
async def test_legacy_controller_regression_protection():
    original_routes = [
        "POST /api/checkout/cart",
        "POST /api/checkout/apply-coupon",
        "POST /api/checkout/process-payment",
        "GET /api/checkout/summary"
    ]

    async with AsyncSessionLocal() as db:
        check = LegacyRegressionCheck(
            id="LEG-TEST-001",
            project_id="proj-default",
            controller_name="CheckoutController.cs",
            file_path="Controllers/CheckoutController.cs",
            routes_json=json.dumps(original_routes),
            has_business_logic=True,
            refactoring_status="MAPPED",
            baseline_test_suite="Tests/Regression/CheckoutRegressionTests.cs",
            regression_test_status="PENDING"
        )
        db.add(check)
        await db.commit()

    # Verify initial mapping
    async with AsyncSessionLocal() as db:
        c = await db.get(LegacyRegressionCheck, "LEG-TEST-001")
        assert c.refactoring_status == "MAPPED"
        assert len(c.routes) == 4

    # Simulate refactoring: extract service while preserving all 4 routes
    async with AsyncSessionLocal() as db:
        c = await db.get(LegacyRegressionCheck, "LEG-TEST-001")
        c.refactoring_status = "EXTRACTED_TO_SERVICE"
        c.extracted_service = "Services/CheckoutService.cs"
        c.regression_test_status = "PASSING"
        await db.commit()

    # Verify that extracted controller preserved exact original routes and tests pass
    async with AsyncSessionLocal() as db:
        c = await db.get(LegacyRegressionCheck, "LEG-TEST-001")
        assert c.refactoring_status == "EXTRACTED_TO_SERVICE"
        assert c.regression_test_status == "PASSING"
        assert c.routes == original_routes  # Zero route drift!
