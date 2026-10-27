# Autonomous Engineering Swarm 🤖🚀

[![CI Pipeline](https://github.com/org/autonomous-engineering-swarm/actions/workflows/ci.yml/badge.svg)](https://github.com/org/autonomous-engineering-swarm/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.13](https://img.shields.io/badge/Python-3.13-blue.svg)](https://python.org)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev)

A production-oriented, multi-agent AI engineering system designed to operate autonomously from a single user prompt through project discovery, architectural planning, parallel coding in isolated worktrees, automated testing, CI/CD verification, staging deployment, and gated release.

Built as both a **Reusable Global Antigravity Skill** and a **Standalone Software Project**.

---

## 🌟 Key Capabilities

- **17-Role Agent Organization**: Structured hierarchy spanning Leadership, Implementation, DevOps, QA, Infrastructure, Assembly, and Security Gate.
- **Strict Concurrency Governor**: Hard ceiling of **8 concurrent coding workers** executed in isolated Git worktrees.
- **Zero-Trust Evidence Verification**: Rejects LLM self-reporting without valid commit SHAs, exit code `0`, and verified test artifacts.
- **Deterministic State Machine**: `PLANNED` ➔ `READY` ➔ `IN_PROGRESS` ➔ `REVIEW` ➔ `TESTING` ➔ `READY_TO_RELEASE` ➔ `VERIFIED`.
- **Automatic Failure Recovery Loop**: Actions Watcher classifies CI & test failures (`CODE_ERROR`, `DEPENDENCY`, `INFRASTRUCTURE`, `FLAKY`) and routes defects back to workers with a 3-retry budget before dead-letter escalation.
- **Gated Human Approval Center**: Production deployments and destructive database migrations strictly require human authorization.
- **VM Fleet & Infrastructure Handler**: Drift detection, repeatable Ansible rollout, staging smoke checks, and zero secret exposure.
- **Interactive Visual Dashboard**: Polished React + TypeScript UI with Dark/Light theme, live DAG assignment visualization ("Who assigns What to Whom"), Kanban board, and real-time WebSockets.

---

## 🏛 Agent Organization Hierarchy

```
                          ┌───────────────────────────┐
                          │    Chief Orchestrator     │
                          │      (Team Leader)        │
                          └─────────────┬─────────────┘
                                        │
        ┌───────────────────────┬───────┴───────────────┬────────────────────────┐
        ▼                       ▼                       ▼                        ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐       ┌────────────────┐
│Project Manager│       │Product Analyst│       │ R&D Engineer  │       │Chief Architect │
└───────────────┘       └───────────────┘       └───────────────┘       └───────┬────────┘
                                                                                │
                                ┌───────────────────────────────────────────────┘
                                ▼
        ┌───────────────────────────────────────────────┐
        │ Senior Engineer 1     │   Senior Engineer 2   │
        │ (Backend & Core)      │ (Frontend & State)    │
        └───────┬───────────────────────────────┬───────┘
                ▼                               ▼
  ┌───────────────────────────┐   ┌───────────────────────────┐
  │ Junior Engineer 1 & 3     │   │ Junior Engineer 2         │
  │ (Feature & Regressions)   │   │ (UI & API Integration)    │
  └─────────────┬─────────────┘   └─────────────┬─────────────┘
                └───────────────────────┬───────┘
                                        ▼
                      ┌───────────────────────────────────┐
                      │ Dynamic Coding Workers (Pool: 1-8)│
                      │ (Isolated Git Worktrees)          │
                      └─────────────────┬─────────────────┘
                                        │
        ┌───────────────────────┬───────┴───────────────┬────────────────────────┐
        ▼                       ▼                       ▼                        ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐       ┌────────────────┐
│DevOps Engineer│       │Actions Watcher│       │  QA Simulation│       │VM Fleet Handler│
└───────────────┘       └───────────────┘       └───────────────┘       └────────────────┘
                                        │
                                        ▼
                      ┌───────────────────────────────────┐
                      │ Review & Assembly │ Security Gate │
                      └───────────────────────────────────┘
```

---

## 📦 Deliverable A: Global Antigravity Skill

The swarm includes an installable global skill that enables Antigravity to run this multi-agent engineering process on any future project.

### 1. Global Skill Installation

#### Windows (PowerShell):
```powershell
.\scripts\install-global-skill.ps1
```

#### Linux / macOS:
```bash
./scripts/install-global-skill.sh
```

The script copies the skill to:
- `~/.gemini/config/skills/autonomous-engineering-swarm/`
- Configures `~/.gemini/config/skills.json` for global discovery.

### 2. Invoking the Skill in Any Project
Once installed, trigger the skill in any repository turn by asking:
> *"Orchestrate the autonomous engineering swarm to implement feature X, run automated tests, and prepare a staging release."*

Antigravity will automatically activate `autonomous-engineering-swarm`, run stack discovery (`scripts/verify-project-stack.py`), generate task contracts, enforce the 8-worker concurrency ceiling, and report verifiable evidence.

---

## 💻 Deliverable B: Standalone Project & Visual Dashboard

### 1. Quickstart (Zero-Setup Local SQLite)

#### Step 1: Install Dependencies & Run Automated Tests
```powershell
cd backend
python -m pip install -r requirements.txt
python -m pytest tests -v
```

#### Step 2: Start the System
```powershell
# Windows
.\scripts\run-all.ps1

# Linux / Mac
./scripts/run-all.sh
```

Open your browser at **`http://localhost:8000`** to access the interactive dashboard.

### 2. Running with Docker Compose (PostgreSQL + Nginx)

```bash
docker-compose up --build
```
- Dashboard: `http://localhost:5173`
- Backend API Docs: `http://localhost:8000/docs`

---

## 🖥 Dashboard Feature Walkthrough

### 1. Organization & Agent Hierarchy
- Visual tree of all 17 agents.
- Real-time status indicators (`RUNNING`, `IDLE`, `BLOCKED`, `COMPLETED`).
- Click any agent to inspect its leased task, activity logs, decision history, and completed task count.

### 2. Live Task Assignment ("Who Assigns What to Whom")
- Real-time audit trail of assignment events: `Chief Orchestrator ➔ Senior Engineer 1`, `QA Engineer ➔ Actions Sentinel`.
- Interactive dependency DAG showing required upstream tasks and verified commit SHAs.

### 3. Kanban Task Board
- Full 9-column board: `PLANNED`, `READY`, `IN_PROGRESS`, `REVIEW`, `TESTING`, `BLOCKED`, `READY_TO_RELEASE`, `VERIFIED`, `FAILED`.
- Multi-filtering by priority, status, and task title search.

### 4. Live Execution Monitor
- Visual gauge of **Active Coding Workers out of 8**.
- Queue length, running test journeys, CI failure alerts, healthy VM count.
- Progress bar driven strictly by verified acceptance criteria.
- User input box to submit new autonomous instructions directly into the swarm.

### 5. GitHub & CI/CD Monitor
- Workflow runs, branch list, commit SHAs, and failed step analysis.
- Actions Watcher diagnosis tags (`CODE_ERROR`, `DEPENDENCY`, `INFRASTRUCTURE`, `FLAKY`).
- Explicit `SIMULATED CI` / `LIVE` badges.

### 6. VM Fleet Dashboard
- Multi-VM staging and production inventory.
- Health checks, version tracking, drift warnings with **secret redaction guarantee** (zero token/password leakage).
- Single-click VM reconciliation and sync.

### 7. Human Approval Center
- Enforces strict dual-control for production deployments and destructive schema migrations.
- Displays commit SHA, risk assessment, verified test artifacts, and rollback procedure.
- Single-click Approve / Reject buttons with operator audit logs.

### 8. System Controls
- **Emergency Kill Switch**: Instantly pauses all active worker execution and pending dispatches.
- **Simulate Defect & Recovery**: Demonstrates failure reproduction, retry budget routing, and verification.

---

## 🧪 Automated Test Suite

Run the comprehensive pytest test suite covering all 10 architectural requirements:

```powershell
cd backend
python -m pytest tests -v
```

### Coverage Highlights:
- ✅ `test_dag.py`: Task DAG construction, cycle rejection, topological scheduling.
- ✅ `test_concurrency.py`: Enforces strict 8-worker concurrency ceiling under heavy task load.
- ✅ `test_contracts.py`: Validates task dispatch schemas, rejects boundary violations.
- ✅ `test_state_machine.py`: Verifies legal transitions and prohibits illegal direct jumps to `VERIFIED`.
- ✅ `test_recovery.py`: Verifies 3-attempt retry budget and dead-letter queue routing.
- ✅ `test_github_adapter.py`: Validates HMAC webhook signatures, deduplication, CI failure classification.
- ✅ `test_approvals.py`: Guards production deployments until explicit human signoff.
- ✅ `test_vm_adapter.py`: Validates health probes, drift detection, and secret redaction.
- ✅ `test_orchestrator_recovery.py`: Verifies state recovery of interrupted tasks after process crash.
- ✅ `test_e2e_workflow.py`: Multi-agent execution loop with failure simulation and verified recovery.

---

## 🚀 Publishing to GitHub

To push this repository to your GitHub account:

```bash
cd D:\Projects\autonomous-engineering-swarm

# 1. Verify git status
git status

# 2. Add and commit all files
git add .
git commit -m "feat: initial release of autonomous-engineering-swarm with 17-agent hierarchy and visual dashboard"

# 3. Create a new repository on GitHub (e.g. named 'autonomous-engineering-swarm')
# 4. Link remote and push:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/autonomous-engineering-swarm.git
git branch -M main
git push -u origin main
```

---

## 📄 License

MIT License. Designed for scalable, autonomous agentic engineering.
