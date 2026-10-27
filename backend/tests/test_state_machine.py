"""Tests for State Machine transitions and evidence constraints."""
import pytest
from app.core.state_machine import (
    TaskState,
    validate_transition,
    InvalidStateTransitionError
)

def test_legal_lifecycle_transitions():
    assert validate_transition(TaskState.PLANNED, TaskState.READY) is True
    assert validate_transition(TaskState.READY, TaskState.IN_PROGRESS) is True
    assert validate_transition(TaskState.IN_PROGRESS, TaskState.REVIEW) is True
    assert validate_transition(TaskState.REVIEW, TaskState.TESTING) is True
    assert validate_transition(TaskState.TESTING, TaskState.VERIFIED, evidence_verified=True) is True

def test_illegal_jump_to_verified():
    # Direct jump from PLANNED to VERIFIED is prohibited
    with pytest.raises(InvalidStateTransitionError):
        validate_transition(TaskState.PLANNED, TaskState.VERIFIED)

    # Direct jump from IN_PROGRESS to VERIFIED is prohibited
    with pytest.raises(InvalidStateTransitionError):
        validate_transition(TaskState.IN_PROGRESS, TaskState.VERIFIED)

def test_verified_requires_evidence():
    # Cannot transition to VERIFIED without verified evidence
    with pytest.raises(InvalidStateTransitionError) as exc_info:
        validate_transition(TaskState.TESTING, TaskState.VERIFIED, evidence_verified=False)
    assert "without verified test and commit evidence" in str(exc_info.value)
