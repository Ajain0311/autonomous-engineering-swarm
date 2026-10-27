"""Tests for Agent Contracts and Result Evidence validation."""
import pytest
from app.core.contracts import (
    AgentTaskContract,
    WorkerResultEvidence,
    TestResultEvidence,
    CommandExecutionResult,
    verify_evidence_contract
)

def test_contract_schema_validation():
    # Valid contract
    c = AgentTaskContract(
        task_id="TASK-101",
        assigned_role="Senior Engineer 1",
        title="Add auth route",
        goal="Build JWT authentication",
        acceptance_criteria=["Return 200 on valid credentials"],
        allowed_file_patterns=["backend/src/**"]
    )
    assert c.task_id == "TASK-101"

    # Invalid task_id pattern
    with pytest.raises(ValueError):
        AgentTaskContract(
            task_id="INVALID_ID",
            assigned_role="Senior Engineer 1",
            title="Add auth route",
            goal="Build JWT authentication",
            acceptance_criteria=["Return 200"]
        )

def test_evidence_verification_pass():
    contract = AgentTaskContract(
        task_id="TASK-101",
        assigned_role="Senior Engineer 1",
        title="Add auth route",
        goal="Build JWT authentication",
        acceptance_criteria=["Return 200 on valid credentials"],
        allowed_file_patterns=["backend/src/**"]
    )

    evidence = WorkerResultEvidence(
        task_id="TASK-101",
        status="COMPLETED",
        summary_of_changes="Implemented JWT auth",
        commit_sha="a1b2c3d4e5f67890",
        changed_files=["backend/src/auth.py"],
        commands_executed=[
            CommandExecutionResult(command="pytest", exit_code=0, stdout_summary="5 passed")
        ],
        test_results=TestResultEvidence(passed=True, total_tests=5, failures=0)
    )

    result = verify_evidence_contract(contract, evidence)
    assert result["valid"] is True
    assert len(result["violations"]) == 0

def test_evidence_boundary_violation():
    contract = AgentTaskContract(
        task_id="TASK-101",
        assigned_role="Junior Engineer 1",
        title="Scoped bugfix",
        goal="Fix form validation",
        acceptance_criteria=["Form checks email format"],
        allowed_file_patterns=["frontend/src/forms/**"]
    )

    # Worker changed a file outside allowed boundaries
    evidence = WorkerResultEvidence(
        task_id="TASK-101",
        status="COMPLETED",
        summary_of_changes="Fixed form and touched backend db",
        commit_sha="a1b2c3d4e5f67890",
        changed_files=["frontend/src/forms/login.tsx", "backend/src/db.py"],
        test_results=TestResultEvidence(passed=True, total_tests=5, failures=0)
    )

    result = verify_evidence_contract(contract, evidence)
    assert result["valid"] is False
    assert any("violates allowed patterns" in v for v in result["violations"])
