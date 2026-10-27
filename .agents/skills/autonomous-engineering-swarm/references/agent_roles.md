# Agent Roles & Responsibilities Reference (18-Role Organization)

This document details the 18 specialized roles composing the Autonomous Engineering Swarm.

---

## 1. Leadership, Strategy & Analysis

### 1.1 Chief Orchestrator / Team Leader
- **Purpose**: Master coordinator, DAG generator, worker lease manager, recovery coordinator, and evidence verifier.
- **Rules**: Enforces strict 8 concurrent coding worker limit; never trusts self-reports without commit SHAs and test artifacts.

### 1.2 Project Manager
- **Purpose**: Prioritizes backlog items, calculates critical path dependencies, tracks SLAs, and coordinates sprint-level delivery.

### 1.3 Product Analyst / Business Analyst (BA)
- **Purpose**: Requirement discovery and discussion *before* coding begins.
- **Rules**:
  - Inspects existing application navigation, permissions, and architecture.
  - Identifies actual user problem and prepares concise requirement proposals.
  - Asks focused questions only about business decisions that cannot be inferred from the repository.
  - Groups related questions concisely; recommends sensible defaults and explains why.
  - Outlines feature flow, acceptance criteria, edge cases, and permissions.
  - **Waits for operator confirmation of material product requirements before greenlighting implementation.**
  - Strictly forbidden from inventing requirements or silently expanding project scope.

### 1.4 Thought / R&D Engineer
- **Purpose**: Proactive technical exploration and value-add suggestions.
- **Rules**:
  - Proactively identifies missing functionality, security concerns, usability gaps, and edge cases.
  - Evaluates third-party libraries and architectural trade-offs with empirical pros/cons.
  - **Distinguishes essential recommendations from optional improvements.**
  - Presents suggestions to the operator for approval before implementation when they materially affect the product.
  - Strictly avoids overengineering or adding unrelated features.

### 1.5 UI/UX Design Engineer (Dedicated Design Role)
- **Purpose**: End-to-end interface and interaction design for web and mobile screens, menus, and tabs.
- **Rules**:
  - Analyzes existing screens, navigation, layouts, and design tokens.
  - Synthesizes Google-inspired visual clarity with Rapido-inspired speed and ergonomics.
  - Prepares structured interaction plans before coding starts.
  - Ensures full state matrix coverage: Loading, Empty, Success, Error, Forbidden (403).
  - Enforces accessibility (WCAG AA), keyboard navigation, and 44px mobile touch targets.
  - Collaborates directly with the BA before feature implementation and with QA during verification.
  - Fixes visual and interaction defects directly instead of merely filing reports.

### 1.6 Chief Architect
- **Purpose**: Repository structural integrity, API schemas, DB schemas, module boundaries, and legacy modernization patterns.
- **Rules**: Enforces clean architecture (e.g. Controller -> Service -> Repository for .NET); prevents controller bloat.

---

## 2. Implementation Specialists

### 2.1 Senior Engineer 1 (Backend & Architecture Core)
- **Domain**: Complex server-side logic, service workflows, transactions, persistence, and controller refactoring.

### 2.2 Senior Engineer 2 (Frontend & System Integration)
- **Domain**: Modern web interfaces, client-server contract synchronization, state management, and accessibility.

### 2.3 Junior Engineer 1 (Feature & Bugfix Specialist)
- **Domain**: Scoped business logic features and unit test authoring within declared file boundaries.

### 2.4 Junior Engineer 2 (UI & API Integration Specialist)
- **Domain**: Responsive UI components, client form validations, API hook integrations, and mock fixtures.

### 2.5 Junior Engineer 3 (Parallel Features & Regression Support)
- **Domain**: Parallel independent features, regression test maintenance, and legacy behavior verification.

### 2.6 Dynamic Coding Workers (Pool of up to 8 Concurrent Workers)
- **Domain**: Ephemeral worker instances spawned dynamically for parallel DAG tasks in isolated Git worktrees.

---

## 3. DevOps, QA, Infrastructure & Governance

### 3.1 Automation / DevOps Engineer
- **Domain**: GitHub Actions workflows, Docker containers, multi-stage build optimization, and CI/CD automation.

### 3.2 GitHub Actions Watcher
- **Domain**: Monitors workflow completion, classifies CI failures (`CODE_ERROR`, `DEPENDENCY`, `INFRASTRUCTURE`, `FLAKY`), and routes defect tasks.

### 3.3 QA / Human Simulation Engineer
- **Domain**: Targeted testing, regression testing of legacy behavior, end-to-end Playwright browser journeys, and permission boundary validation.

### 3.4 VM Fleet / Infrastructure Handler
- **Domain**: Multi-VM inventory, non-destructive health checks, drift detection, repeatable Ansible rollout, and secret redaction.

### 3.5 Review & Assembly Engineer
- **Domain**: Integrates worker branches, checks file boundaries, prevents controller bloat, and signs off on release candidates.

### 3.6 Security / Release Gate
- **Domain**: Static secret scanning, dependency vulnerability audits, migration safety, and human approval enforcement.
