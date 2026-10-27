"""Task State Machine and Transition Enforcement."""
from enum import Enum
from typing import Set, Dict
from datetime import datetime

class TaskState(str, Enum):
    PLANNED = "PLANNED"
    READY = "READY"
    IN_PROGRESS = "IN_PROGRESS"
    REVIEW = "REVIEW"
    TESTING = "TESTING"
    READY_TO_RELEASE = "READY_TO_RELEASE"
    VERIFIED = "VERIFIED"
    BLOCKED = "BLOCKED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class InvalidStateTransitionError(Exception):
    """Raised when an illegal state transition is attempted."""
    def __init__(self, from_state: TaskState, to_state: TaskState, reason: str = ""):
        self.from_state = from_state
        self.to_state = to_state
        msg = f"Illegal transition from '{from_state.value}' to '{to_state.value}'."
        if reason:
            msg += f" Reason: {reason}"
        super().__init__(msg)

# Strict legal transitions map
LEGAL_TRANSITIONS: Dict[TaskState, Set[TaskState]] = {
    TaskState.PLANNED: {
        TaskState.READY,
        TaskState.BLOCKED,
        TaskState.CANCELLED,
    },
    TaskState.READY: {
        TaskState.IN_PROGRESS,
        TaskState.BLOCKED,
        TaskState.CANCELLED,
    },
    TaskState.IN_PROGRESS: {
        TaskState.REVIEW,
        TaskState.BLOCKED,
        TaskState.FAILED,
        TaskState.CANCELLED,
    },
    TaskState.REVIEW: {
        TaskState.TESTING,
        TaskState.IN_PROGRESS,  # routed back for code adjustments
        TaskState.BLOCKED,
        TaskState.FAILED,
        TaskState.CANCELLED,
    },
    TaskState.TESTING: {
        TaskState.READY_TO_RELEASE,
        TaskState.VERIFIED,      # For non-release tasks that complete at verification
        TaskState.IN_PROGRESS,  # Defect detected, routed back for retry
        TaskState.BLOCKED,
        TaskState.FAILED,
        TaskState.CANCELLED,
    },
    TaskState.READY_TO_RELEASE: {
        TaskState.VERIFIED,     # Release gate passed and approved
        TaskState.FAILED,       # Release gate rejected or staging deploy failure
        TaskState.CANCELLED,
    },
    TaskState.BLOCKED: {
        TaskState.READY,        # Unblocked, ready for pickup
        TaskState.IN_PROGRESS,  # Resumed
        TaskState.CANCELLED,
        TaskState.FAILED,
    },
    TaskState.FAILED: {
        TaskState.READY,        # Manual operator retry/reset
        TaskState.CANCELLED,
    },
    TaskState.VERIFIED: set(),   # Terminal state
    TaskState.CANCELLED: set(),  # Terminal state
}

def validate_transition(from_state: TaskState, to_state: TaskState, evidence_verified: bool = True) -> bool:
    """
    Validates whether a transition is allowed.
    Raises InvalidStateTransitionError if illegal.
    """
    if from_state == to_state:
        return True
        
    allowed_next = LEGAL_TRANSITIONS.get(from_state, set())
    if to_state not in allowed_next:
        raise InvalidStateTransitionError(from_state, to_state, "Transition not defined in state machine")
        
    # Moving to VERIFIED requires evidence verification flag to be true
    if to_state == TaskState.VERIFIED and not evidence_verified:
        raise InvalidStateTransitionError(
            from_state,
            to_state,
            "Cannot transition to VERIFIED without verified test and commit evidence"
        )
        
    return True
