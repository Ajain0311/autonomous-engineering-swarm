"""Agent Task Contracts and Evidence Verification Schemas."""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator
import re

class TaskBudget(BaseModel):
    max_duration_seconds: int = 600
    max_retries: int = 3
    token_limit: int = 100000

class AgentTaskContract(BaseModel):
    task_id: str = Field(..., description="Unique task identifier, e.g. TASK-001")
    project_id: str = Field(default="proj-default")
    assigned_role: str = Field(..., description="Role responsible for execution")
    assigned_by: str = Field(default="Chief Orchestrator")
    title: str
    goal: str
    acceptance_criteria: List[str] = Field(..., min_length=1)
    repository_url: Optional[str] = None
    base_commit: Optional[str] = None
    target_branch: Optional[str] = None
    allowed_file_patterns: List[str] = Field(default_factory=list)
    dependencies: List[str] = Field(default_factory=list)
    test_command: Optional[str] = None
    budget: TaskBudget = Field(default_factory=TaskBudget)

    @field_validator("task_id")
    def validate_task_id(cls, v):
        if not re.match(r"^TASK-[0-9]{3,}$", v):
            raise ValueError("Task ID must match format TASK-XXX (e.g., TASK-001)")
        return v

class CommandExecutionResult(BaseModel):
    command: str
    exit_code: int
    stdout_summary: str

class TestResultEvidence(BaseModel):
    passed: bool
    total_tests: int = 0
    failures: int = 0
    artifact_paths: List[str] = Field(default_factory=list)
    output_log: Optional[str] = None

# Tell pytest not to collect TestResultEvidence as a test class
TestResultEvidence.__test__ = False

class WorkerResultEvidence(BaseModel):
    task_id: str
    status: str = Field(..., description="COMPLETED, FAILED, or BLOCKED")
    summary_of_changes: str
    commit_sha: Optional[str] = None
    changed_files: List[str] = Field(default_factory=list)
    commands_executed: List[CommandExecutionResult] = Field(default_factory=list)
    test_results: TestResultEvidence
    known_risks: List[str] = Field(default_factory=list)
    blockers: List[str] = Field(default_factory=list)
    follow_up_tasks: List[str] = Field(default_factory=list)

    @field_validator("commit_sha")
    def validate_commit_sha(cls, v, info):
        # If status is COMPLETED, commit_sha must look like a git hash
        values = info.data
        if values.get("status") == "COMPLETED" and v:
            if not re.match(r"^[0-9a-fA-F]{7,40}$", v):
                raise ValueError("commit_sha must be a valid 7 to 40 char hex git SHA")
        return v

def verify_evidence_contract(
    contract: AgentTaskContract,
    evidence: WorkerResultEvidence
) -> Dict[str, Any]:
    """
    Verifies that worker output strictly conforms to contract boundaries:
    1. Status is COMPLETED
    2. Commit SHA is present and valid
    3. Test results passed with 0 failures
    4. Changed files do not violate allowed_file_patterns
    """
    violations = []
    
    if evidence.status != "COMPLETED":
        violations.append(f"Worker status is {evidence.status}, not COMPLETED")
        
    if not evidence.commit_sha:
        violations.append("Missing commit_sha in completion evidence")
        
    if not evidence.test_results.passed or evidence.test_results.failures > 0:
        violations.append(f"Test suite failed with {evidence.test_results.failures} failures")
        
    # Boundary check: changed files
    if contract.allowed_file_patterns:
        for changed_file in evidence.changed_files:
            # Simple prefix / glob pattern checker
            matched = False
            for pattern in contract.allowed_file_patterns:
                clean_pattern = pattern.replace("**", "").replace("*", "")
                if clean_pattern in changed_file:
                    matched = True
                    break
            if not matched:
                violations.append(f"Changed file '{changed_file}' violates allowed patterns: {contract.allowed_file_patterns}")

    return {
        "valid": len(violations) == 0,
        "violations": violations
    }
