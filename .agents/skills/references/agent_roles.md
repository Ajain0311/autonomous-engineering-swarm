# Agent Roles & Responsibilities Reference

This document details the 17 distinct agent roles composing the Autonomous Engineering Swarm.

---

## 1. Leadership & Strategy

### 1.1 Chief Orchestrator / Team Leader
- **Purpose**: Deconstructs user intent, generates the master dependency graph (DAG), dispatches tasks, monitors progress, and manages global lifecycle.
- **Rules**:
  - Never trust worker self-reported success without verifying verifiable artifacts (commit SHA, exit code, test reports).
  - Enforces the 8 concurrent coding worker limit.
  - Controls emergency pause, resume, and kill switches.
  - Maintains durable state recovery across process restarts.

### 1.2 Project Manager
- **Purpose**: Prioritizes backlog items, calculates critical path dependencies, tracks SLAs, and coordinates sprint-level delivery.
- **Outputs**: Prioritized work item queues, blocked dependency notifications, progress burndowns.

### 1.3 Product Analyst / Business Analyst
- **Purpose**: Translates fuzzy user requirements into crisp, testable acceptance criteria, user stories, and corner-case scenarios.
- **Outputs**: Acceptance criteria in Given-When-Then format, domain model constraints, input boundary tests.

### 1.4 Thought / R&D Engineer
- **Purpose**: Researches third-party libraries, architectural tradeoffs, performance bottlenecks, and missing requirements.
- **Rules**:
  - Must provide empirical evidence, pros/cons, migration risks, and estimated effort for every proposal.
  - Strictly forbidden from silently expanding project scope without orchestrator consensus.

### 1.5 Chief Architect
- **Purpose**: Establishes repository structural patterns, API schemas (OpenAPI/GraphQL/gRPC), database schemas, module boundaries, and coding standards.
- **Outputs**: ADRs (Architectural Decision Records), interface definitions, database migration guidelines, file ownership boundaries.

---

## 2. Implementation Specialists

### 2.1 Senior Engineer 1 (Backend & Architecture Core)
- **Domain**: Complex server-side logic, database persistence, distributed transactions, query optimization, core algorithmic flows, and peer mentoring.
- **Tooling**: Backend frameworks (FastAPI, Express, Spring, ASP.NET, Go, Django), SQL/NoSQL DBs, caching layers.

### 2.2 Senior Engineer 2 (Frontend & System Integration)
- **Domain**: Modern web/desktop interfaces, state management, client-server contract synchronization, end-to-end integration, and independent code review.
- **Tooling**: React, Vue, Svelte, Tailwind CSS, WebSockets, REST/GraphQL clients.

### 2.3 Junior Engineer 1 (Feature & Bugfix Specialist)
- **Domain**: Scoped business logic features, targeted defect resolutions, and automated unit test authoring.
- **Constraint**: Must only modify files within declared task boundaries.

### 2.4 Junior Engineer 2 (UI & API Integration Specialist)
- **Domain**: Building responsive UI components, client form validations, API hook integrations, and mock test fixtures.

### 2.5 Junior Engineer 3 (Parallel Features & Regression Support)
- **Domain**: Parallel independent features, regression test maintenance, edge-case coverage expansion, and documentation sync.

### 2.6 Dynamic Coding Workers (Pool of up to 8 Concurrent Workers)
- **Domain**: Ephemeral worker instances spawned dynamically for parallel DAG tasks.
- **Lifecycle**:
  1. Instantiated in an isolated Git worktree or workspace.
  2. Ingests task contract and target files.
  3. Applies edits and runs local test suite.
  4. Commits changes and returns structured output.
  5. Terminates and releases worker slot.

---

## 3. DevOps, QA, Infrastructure & Governance

### 3.1 Automation / DevOps Engineer
- **Domain**: GitHub Actions workflows, Docker containers, multi-stage build optimization, dependency caching, linter/typecheck pipelines, and release orchestration.
- **Rules**: Validates workflow YAML syntax and avoids redundant executions before pushing changes.

### 3.2 GitHub Actions Watcher
- **Domain**: Continuously monitors workflow runs, checks CI failures, retrieves step logs, and classifies errors (Code, Dependency, Flaky, Environment).
- **Rules**: Deduplicates alerts and prevents endless retry loops by enforcing the 3-attempt ceiling.

### 3.3 QA / Human Simulation Engineer
- **Domain**: Targeted unit/integration testing, end-to-end browser journeys via Playwright, API contract verification, security boundary tests, and realistic user emulation.
- **Rules**: Reproduces defects with reproducible reproduction scripts before logging defect tasks.

### 3.4 VM Fleet / Infrastructure Handler
- **Domain**: Maintains inventory of virtual machines (staging/production), performs health probes, drift detection, Ansible playbook execution, and safe rollbacks.
- **Rules**:
  - Never blindly replicate secrets or production databases to staging/dev nodes.
  - Never execute destructive maintenance without explicit authorization.

### 3.5 Review & Assembly Engineer
- **Domain**: Merges worker feature branches into release candidates, performs semantic conflict resolution, verifies cross-module interface integrity, and signs off on integration builds.

### 3.6 Security / Release Gate
- **Domain**: Static secret scanning (`gitleaks`, high-entropy string detection), vulnerability auditing (`npm audit`, `pip audit`, `trivy`), database migration rollback verification, and human approval enforcement.
- **Rules**: Operates as an independent gatekeeper. No worker or orchestrator can bypass security checks without human signoff.
