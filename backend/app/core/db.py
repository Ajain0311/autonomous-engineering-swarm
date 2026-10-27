"""Database Models and Persistence Layer."""
from datetime import datetime
from typing import List, Optional
import json

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, relationship

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
    created_at = Column(DateTime, default=datetime.utcnow)

class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True)  # e.g. "agent-orchestrator", "agent-senior-1"
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    status = Column(String, default="IDLE")  # IDLE, RUNNING, BLOCKED, FAILED, COMPLETED
    current_task_id = Column(String, nullable=True)
    parent_id = Column(String, nullable=True)
    model = Column(String, default="Gemini 1.5 Pro")
    tasks_completed = Column(Integer, default=0)
    tasks_failed = Column(Integer, default=0)
    last_activity = Column(DateTime, default=datetime.utcnow)
    logs_json = Column(Text, default="[]")  # List of log messages

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

    id = Column(String, primary_key=True)  # TASK-001
    project_id = Column(String, default="proj-default")
    title = Column(String, nullable=False)
    goal = Column(Text, nullable=False)
    status = Column(String, default="PLANNED")  # PLANNED, READY, IN_PROGRESS, REVIEW, TESTING, READY_TO_RELEASE, VERIFIED, BLOCKED, FAILED, CANCELLED
    priority = Column(String, default="MEDIUM")  # HIGH, MEDIUM, LOW
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
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

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
    assigned_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class Approval(Base):
    __tablename__ = "approvals"

    id = Column(String, primary_key=True)  # APP-001
    project_id = Column(String, default="proj-default")
    action_type = Column(String, nullable=False)  # PRODUCTION_DEPLOYMENT, DESTRUCTIVE_MIGRATION, VM_DELETION
    title = Column(String, nullable=False)
    commit_sha = Column(String, nullable=True)
    risk_summary = Column(Text, nullable=False)
    test_evidence = Column(Text, nullable=True)
    rollback_plan = Column(Text, nullable=False)
    status = Column(String, default="PENDING")  # PENDING, APPROVED, REJECTED
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class WorkflowRun(Base):
    __tablename__ = "workflow_runs"

    id = Column(String, primary_key=True)
    repo = Column(String, nullable=False)
    branch = Column(String, nullable=False)
    commit_sha = Column(String, nullable=False)
    workflow_name = Column(String, nullable=False)
    status = Column(String, default="completed")  # queued, in_progress, completed
    conclusion = Column(String, default="success")  # success, failure, neutral
    failed_step = Column(String, nullable=True)
    failure_category = Column(String, nullable=True)  # CODE_ERROR, DEPENDENCY, INFRASTRUCTURE, FLAKY
    linked_task_id = Column(String, nullable=True)
    log_excerpt = Column(Text, nullable=True)
    simulated = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class VmNode(Base):
    __tablename__ = "vm_nodes"

    id = Column(String, primary_key=True)  # vm-stage-01
    alias = Column(String, nullable=False)
    environment = Column(String, default="staging")  # staging, production
    host = Column(String, nullable=False)
    role = Column(String, default="api")
    current_version = Column(String, default="v1.0.0")
    target_version = Column(String, default="v1.0.0")
    status = Column(String, default="HEALTHY")  # HEALTHY, DEGRADED, DRIFT_DETECTED, OFFLINE
    drift_details = Column(Text, nullable=True)
    health_check_url = Column(String, nullable=True)
    is_simulated = Column(Boolean, default=True)
    last_sync_at = Column(DateTime, default=datetime.utcnow)

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
    updated_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_type = Column(String, nullable=False)
    actor = Column(String, default="SYSTEM")
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Engine & Session setup
engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
