"""Database Models and Persistence Layer."""
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
import json

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.config import settings

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    repo_path = Column(String, nullable=True)
    branch = Column(String, default="main")
    description = Column(Text, nullable=True)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True)  # e.g. "agent-orchestrator", "agent-uiux"
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    status = Column(String, default="IDLE")  # IDLE, RUNNING, BLOCKED, FAILED, COMPLETED
    current_task_id = Column(String, nullable=True)
    parent_id = Column(String, nullable=True)
    model = Column(String, default="Gemini 1.5 Pro")
    tasks_completed = Column(Integer, default=0)
    tasks_failed = Column(Integer, default=0)
    last_activity = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    logs_json = Column(Text, default="[]")

    @property
    def logs(self) -> List[str]:
        try:
            return json.loads(self.logs_json)
        except Exception:
            return []

    @logs.setter
    def logs(self, value: List[str]):
        self.logs_json = json.dumps(value)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True)
    project_id = Column(String, default="proj-default")
    title = Column(String, nullable=False)
    goal = Column(Text, nullable=False)
    status = Column(String, default="PLANNED")
    priority = Column(String, default="MEDIUM")
    assigned_agent_id = Column(String, nullable=True)
    assigned_by_agent_id = Column(String, default="agent-orchestrator")
    base_commit = Column(String, nullable=True)
    target_branch = Column(String, nullable=True)
    allowed_files_json = Column(Text, default="[]")
    dependencies_json = Column(Text, default="[]")
    acceptance_criteria_json = Column(Text, default="[]")
    test_command = Column(String, nullable=True)
    retries = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    commit_sha = Column(String, nullable=True)
    test_passed = Column(Boolean, default=False)
    test_output = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    @property
    def dependencies(self) -> List[str]:
        try:
            return json.loads(self.dependencies_json)
        except Exception:
            return []

    @property
    def acceptance_criteria(self) -> List[str]:
        try:
            return json.loads(self.acceptance_criteria_json)
        except Exception:
            return []

    @property
    def allowed_files(self) -> List[str]:
        try:
            return json.loads(self.allowed_files_json)
        except Exception:
            return []

class TaskAssignment(Base):
    __tablename__ = "task_assignments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, nullable=False)
    from_agent_id = Column(String, nullable=False)
    to_agent_id = Column(String, nullable=False)
    status = Column(String, default="ASSIGNED")
    rationale = Column(Text, nullable=True)
    assigned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

class Approval(Base):
    __tablename__ = "approvals"

    id = Column(String, primary_key=True)
    project_id = Column(String, default="proj-default")
    action_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    commit_sha = Column(String, nullable=True)
    risk_summary = Column(Text, nullable=False)
    test_evidence = Column(Text, nullable=True)
    rollback_plan = Column(Text, nullable=False)
    status = Column(String, default="PENDING")
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class WorkflowRun(Base):
    __tablename__ = "workflow_runs"

    id = Column(String, primary_key=True)
    repo = Column(String, nullable=False)
    branch = Column(String, nullable=False)
    commit_sha = Column(String, nullable=False)
    workflow_name = Column(String, nullable=False)
    status = Column(String, default="completed")
    conclusion = Column(String, default="success")
    failed_step = Column(String, nullable=True)
    failure_category = Column(String, nullable=True)
    linked_task_id = Column(String, nullable=True)
    log_excerpt = Column(Text, nullable=True)
    simulated = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class VmNode(Base):
    __tablename__ = "vm_nodes"

    id = Column(String, primary_key=True)
    alias = Column(String, nullable=False)
    environment = Column(String, default="staging")
    host = Column(String, nullable=False)
    role = Column(String, default="api")
    current_version = Column(String, default="v1.0.0")
    target_version = Column(String, default="v1.0.0")
    status = Column(String, default="HEALTHY")
    drift_details = Column(Text, nullable=True)
    health_check_url = Column(String, nullable=True)
    is_simulated = Column(Boolean, default=True)
    last_sync_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SystemMetric(Base):
    __tablename__ = "system_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    active_workers = Column(Integer, default=0)
    queue_length = Column(Integer, default=0)
    running_tests = Column(Integer, default=0)
    ci_failures = Column(Integer, default=0)
    active_deployments = Column(Integer, default=0)
    healthy_vms = Column(Integer, default=0)
    verified_criteria_percent = Column(Float, default=0.0)
    kill_switch_active = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_type = Column(String, nullable=False)
    actor = Column(String, default="SYSTEM")
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# ----------------- Modernization & Feature Extensions ----------------- #

class BaDiscussion(Base):
    __tablename__ = "ba_discussions"

    id = Column(String, primary_key=True)  # BA-001
    project_id = Column(String, default="proj-default")
    feature_name = Column(String, nullable=False)
    user_problem = Column(Text, nullable=False)
    proposed_flow = Column(Text, nullable=False)
    questions_json = Column(Text, default="[]")  # List of {id, topic, question, recommended_default, rationale, user_answer, is_answered}
    acceptance_criteria_json = Column(Text, default="[]")
    status = Column(String, default="PENDING_CONFIRMATION")  # PENDING_CONFIRMATION, CONFIRMED, REJECTED
    confirmed_by = Column(String, nullable=True)
    confirmed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    @property
    def questions(self) -> List[Dict[str, Any]]:
        try:
            return json.loads(self.questions_json)
        except Exception:
            return []

    @questions.setter
    def questions(self, value: List[Dict[str, Any]]):
        self.questions_json = json.dumps(value)

    @property
    def acceptance_criteria(self) -> List[str]:
        try:
            return json.loads(self.acceptance_criteria_json)
        except Exception:
            return []

class RdSuggestion(Base):
    __tablename__ = "rd_suggestions"

    id = Column(String, primary_key=True)  # RD-001
    project_id = Column(String, default="proj-default")
    feature_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, default="ESSENTIAL")  # ESSENTIAL vs OPTIONAL
    benefit = Column(Text, nullable=False)
    risk_tradeoff = Column(Text, nullable=False)
    complexity = Column(String, default="MEDIUM")  # LOW, MEDIUM, HIGH
    status = Column(String, default="PROPOSED")  # PROPOSED, APPROVED, DISMISSED
    decided_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class UiUxDesignSpec(Base):
    __tablename__ = "uiux_design_specs"

    id = Column(String, primary_key=True)  # UIUX-001
    project_id = Column(String, default="proj-default")
    screen_name = Column(String, nullable=False)
    menu_path = Column(String, nullable=False)
    allowed_roles_json = Column(Text, default='["Admin", "User"]')
    states_matrix_json = Column(Text, default="{}")  # {loading, empty, success, error, forbidden}
    design_tokens_json = Column(Text, default="{}")  # {primary_color, touch_target_min, spacing}
    status = Column(String, default="VERIFIED")  # DRAFT, REVIEWED, VERIFIED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    @property
    def allowed_roles(self) -> List[str]:
        try:
            return json.loads(self.allowed_roles_json)
        except Exception:
            return []

    @property
    def states_matrix(self) -> Dict[str, Any]:
        try:
            return json.loads(self.states_matrix_json)
        except Exception:
            return {}

class LegacyRegressionCheck(Base):
    __tablename__ = "legacy_regression_checks"

    id = Column(String, primary_key=True)  # LEG-001
    project_id = Column(String, default="proj-default")
    controller_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    routes_json = Column(Text, default="[]")
    has_business_logic = Column(Boolean, default=True)
    refactoring_status = Column(String, default="BASELINE_TESTED")  # MAPPED, BASELINE_TESTED, EXTRACTED_TO_SERVICE, VERIFIED
    baseline_test_suite = Column(String, nullable=False)
    regression_test_status = Column(String, default="PASSING")  # PASSING, FAILING, PENDING
    extracted_service = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    @property
    def routes(self) -> List[str]:
        try:
            return json.loads(self.routes_json)
        except Exception:
            return []

# Engine & Session setup
engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
