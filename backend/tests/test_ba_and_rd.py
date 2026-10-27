"""Tests for Business Analyst requirement discussions and Thought/R&D suggestions."""
import pytest
import json
from datetime import datetime, timezone
from app.core.db import AsyncSessionLocal, BaDiscussion, RdSuggestion

@pytest.mark.asyncio
async def test_ba_requirement_discussion_flow():
    async with AsyncSessionLocal() as db:
        disc = BaDiscussion(
            id="BA-TEST-001",
            project_id="proj-default",
            feature_name="Dynamic Discount Coupons",
            user_problem="Need discount coupons during cart checkout",
            proposed_flow="Cart -> Click coupon -> Apply",
            questions_json=json.dumps([
                {
                    "id": "Q1",
                    "topic": "Expiration Grace",
                    "question": "Allow 15 min lock?",
                    "recommended_default": "Yes",
                    "rationale": "Prevents abandonment",
                    "user_answer": None,
                    "is_answered": False
                }
            ]),
            acceptance_criteria_json='["Coupon verified before checkout"]',
            status="PENDING_CONFIRMATION"
        )
        db.add(disc)
        await db.commit()

    # Verify initial state requires confirmation
    async with AsyncSessionLocal() as db:
        d = await db.get(BaDiscussion, "BA-TEST-001")
        assert d.status == "PENDING_CONFIRMATION"
        questions = d.questions
        assert len(questions) == 1
        assert questions[0]["is_answered"] is False

    # Simulate answering question and confirming
    async with AsyncSessionLocal() as db:
        d = await db.get(BaDiscussion, "BA-TEST-001")
        qs = d.questions
        qs[0]["user_answer"] = "Yes, confirmed"
        qs[0]["is_answered"] = True
        d.questions = qs
        d.status = "CONFIRMED"
        d.confirmed_by = "Product Lead"
        d.confirmed_at = datetime.now(timezone.utc)
        await db.commit()

    async with AsyncSessionLocal() as db:
        d = await db.get(BaDiscussion, "BA-TEST-001")
        assert d.status == "CONFIRMED"
        assert d.questions[0]["user_answer"] == "Yes, confirmed"

@pytest.mark.asyncio
async def test_rd_essential_vs_optional_suggestions():
    async with AsyncSessionLocal() as db:
        essential = RdSuggestion(
            id="RD-TEST-001",
            project_id="proj-default",
            feature_name="Coupons",
            title="Redis Idempotency Redlock",
            category="ESSENTIAL",
            benefit="Stops duplicate claims",
            risk_tradeoff="Needs redis",
            complexity="MEDIUM",
            status="PROPOSED"
        )
        optional = RdSuggestion(
            id="RD-TEST-002",
            project_id="proj-default",
            feature_name="Coupons",
            title="Confetti Celebration Animation",
            category="OPTIONAL",
            benefit="Delights users",
            risk_tradeoff="12kb JS bundle",
            complexity="LOW",
            status="PROPOSED"
        )
        db.add(essential)
        db.add(optional)
        await db.commit()

    async with AsyncSessionLocal() as db:
        e = await db.get(RdSuggestion, "RD-TEST-001")
        assert e.category == "ESSENTIAL"
        o = await db.get(RdSuggestion, "RD-TEST-002")
        assert o.category == "OPTIONAL"

        # Operator approves essential and dismisses optional
        e.status = "APPROVED"
        o.status = "DISMISSED"
        await db.commit()

    async with AsyncSessionLocal() as db:
        e = await db.get(RdSuggestion, "RD-TEST-001")
        assert e.status == "APPROVED"
        o = await db.get(RdSuggestion, "RD-TEST-002")
        assert o.status == "DISMISSED"
