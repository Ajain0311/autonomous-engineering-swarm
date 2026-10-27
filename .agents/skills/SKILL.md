---
name: autonomous-engineering-swarm
description: >-
  Orchestrates an autonomous 17-role engineering agent swarm across software projects.
  Use this skill when the user requests autonomous planning, multi-agent development,
  full-stack coding, automated testing, CI/CD analysis, VM fleet staging deployments,
  and end-to-end verification without micro-management.
---

# Autonomous Engineering Swarm Skill

This skill guides Antigravity to operate as a self-coordinating, 17-role engineering swarm capable of taking high-level user instructions and executing them through discovery, architecture, parallel implementation, automated testing, CI/CD verification, and gated deployment.

## Core Operational Principles

1. **Zero Trust Evidence Verification**: Never mark a task `VERIFIED` based merely on an LLM self-report. Every completion requires tangible evidence: git commit SHA, diff, automated test output with exit code 0, and acceptance criteria validation.
2. **Strict Concurrency Limit**: Enforce a maximum of 8 concurrent coding workers. Dynamic workers are spawned based on unblocked DAG tasks and reaped immediately upon task completion.
3. **Repository Agnostic Discovery**: Discover the target project's language, framework, package manager, and test runners dynamically. Never assume fixed paths, ports, or credentials.
4. **Isolated Worktrees**: Coding workers execute changes in isolated Git worktrees (`git worktree add`) to avoid workspace collision.
5. **Human Approval Gates**: Gated actions (Production Deployments, Destructive Database Migrations, Firewall/VM Changes) strictly require explicit human authorization before execution.
6. **Recovery & Reliability Budget**: Maximum 3 fix attempts per defect before human escalation. Failures generate diagnostic defect tickets assigned to the responsible specialist.

---

## Swarm Workflow Lifecycle

```
[User Request]
       │
       ▼
1. Discovery ──► Inspect repository stack, package scripts, tests, CI/CD, and architecture.
       │
       ▼
2. Planning  ──► Chief Orchestrator + Architect break request into Task DAG & Contracts.
       │
       ▼
3. Execution ──► Dispatch ready tasks to Senior/Junior Workers (max 8 concurrent in worktrees).
       │
       ▼
4. Review    ──► Review & Assembly Engineer merges branches, verifies contracts and diffs.
       │
       ▼
5. QA & CI   ──► QA runs targeted/regression tests; Actions Watcher checks CI workflows.
       │
       ├─ (Defect Found?) ──► Auto-generate Defect Task (Max 3 retries) ──► Route back to Worker.
       │
       ▼
6. Staging   ──► VM Fleet Handler deploys artifact to Staging VM and runs smoke checks.
       │
       ▼
7. Release   ──► Security Gate verifies secrets, deps, audit log ──► Human Approval for Prod.
```

---

## Agent Hierarchy & Roles

The swarm organizes into 17 specialized roles structured under the Chief Orchestrator:
- **Leadership**: Chief Orchestrator (Leader), Project Manager, Product Analyst, Thought / R&D Engineer, Chief Architect.
- **Implementation**: Senior Engineer 1 (Backend/Core), Senior Engineer 2 (Frontend/Integration), Junior Engineers 1, 2, 3 (Scoped Features/UI/Regressions), Dynamic Coding Workers (Up to 8 total concurrent).
- **Quality & Operations**: Automation/DevOps Engineer, GitHub Actions Watcher, QA / Human Simulation Engineer, VM Fleet Handler, Review & Assembly Engineer, Security / Release Gate.

For full role descriptions, system prompts, and assigned toolsets, consult [Agent Roles Reference](./references/agent_roles.md).

---

## Step-by-Step Execution Guide

### Phase 1: Dynamic Project Discovery
Execute stack discovery before planning any code changes:
```powershell
python scripts/verify-project-stack.py
```
Or inspect manually:
1. Identify project language & runtime: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`, or `*.csproj`.
2. Discover test runners: e.g., `npm test`, `pytest`, `cargo test`, `go test ./...`, `dotnet test`.
3. Discover CI/CD workflows: `.github/workflows/*.yml` or equivalent.
4. Discover infrastructure: `Dockerfile`, `docker-compose.yml`, `ansible/`, Terraform, or Kubernetes configs.

### Phase 2: Task Contract Formulation
Every dispatch must conform to the [Agent Contract Schema](./references/task_contracts.md). Use the [Task Plan Template](./resources/templates/task_plan.md) to define:
- Explicit acceptance criteria
- Base commit and branch name
- Allowed file path boundaries
- Required verification command and artifact paths
- Time and retry budgets

### Phase 3: Parallel Worker Execution
- Construct a Dependency DAG.
- Tasks in `READY` status are dispatched to workers up to the concurrency limit of 8.
- Each worker executes in an isolated Git worktree:
  ```powershell
  git worktree add -b feat/task-<id> .worktrees/task-<id> HEAD
  ```
- Worker runs code edits, runs linter and unit tests locally, commits changes, and outputs structured evidence conforming to [Agent Contract](./references/task_contracts.md).

### Phase 4: Assembly & Code Review
- Review & Assembly Engineer inspects the worker PR / branch:
  - Validates that changes remain inside allowed file boundaries.
  - Verifies interface contract compatibility.
  - Resolves any merge conflicts and generates the [Review Report](./resources/templates/review_report.md).

### Phase 5: QA Testing & CI Watcher Loop
- QA Engineer executes targeted tests and end-to-end user journeys (API / Playwright / Database).
- Actions Watcher monitors CI pipeline. If any test or build fails:
  - Classify failure (Syntax, Dependency, Assertion, Infrastructure, Flaky).
  - Generate a [Defect Report](./resources/templates/defect_report.md).
  - Increment retry counter (halt if > 3).
  - Route defect task back to the responsible worker.

### Phase 6: Staging Deployment & VM Fleet Health
- VM Fleet Handler verifies staging VM reachability and current version.
- Deploys versioned release candidate using Ansible or configured deployment script.
- Executes automated post-deployment health check:
  - If degraded: rollback immediately to previous stable digest.
  - If healthy: mark staging deployment as `VERIFIED`.

### Phase 7: Security Audit & Production Approval Gate
- Security Gate runs secret scanning (`gitleaks` / regex), dependency vulnerability checks, and migration safety analysis.
- Prepare [Release Checklist](./resources/templates/release_checklist.md).
- **STRICT GATE**: Present deployment manifest, commit SHA, test evidence, risk summary, and rollback plan to Human Operator. Await explicit human approval before deploying to production.

---

## Detailed References & Templates

- [Agent Roles & Responsibilities](./references/agent_roles.md)
- [Task Orchestration & State Machine Rules](./references/orchestration_rules.md)
- [Agent Task Contract Specifications](./references/task_contracts.md)
- [Recovery, Reliability & Retry Budgets](./references/recovery_and_reliability.md)
- [Security, Secret Redaction & Approval Policies](./references/security_and_approval.md)
- [Task Plan Template](./resources/templates/task_plan.md)
- [Agent Contract Template](./resources/templates/agent_contract.json)
- [Review Report Template](./resources/templates/review_report.md)
- [Defect Report Template](./resources/templates/defect_report.md)
- [Release Checklist Template](./resources/templates/release_checklist.md)
- [Deployment Manifest Template](./resources/templates/deployment_manifest.json)
