---
name: autonomous-engineering-swarm
description: >-
  Orchestrates an autonomous 18-role engineering agent swarm across software projects.
  Use this skill when the user requests autonomous planning, multi-agent development,
  existing legacy codebase modernization, new menus/tabs, UI/UX design, automated testing,
  CI/CD analysis, VM fleet staging deployments, and end-to-end verification.
---

# Autonomous Engineering Swarm Skill (v2.0)

This skill guides Antigravity to operate as a self-coordinating, 18-role engineering swarm capable of modernizing legacy projects and developing new features from a single instruction.

## Core Operational Principles

1. **BA Requirement Gating**: For new features, menus, and tabs, the Business Analyst discusses material decisions, identifies real user problems, presents options with recommended defaults, and awaits operator confirmation before coding begins.
2. **Proactive R&D Suggestions**: The Thought / R&D Engineer suggests high-value improvements, distinguishing *essential* recommendations from *optional* enhancements with clear trade-off analysis.
3. **Dedicated UI/UX Design Engineer**: Enforces Google-inspired visual clarity and Rapido-inspired speed and usability. Requires full 5-state matrix coverage (Loading, Empty, Success, Error, 403 Forbidden).
4. **Legacy Regression Preservation**: Never blindly rewrite existing controllers. Build baseline regression tests before extracting logic into Service/Repository layers (e.g. Controller -> Service -> Repository in .NET).
5. **Zero Trust Evidence Verification**: Tasks cannot reach `VERIFIED` without git commit SHA, exit code 0, and verifiable test artifacts.
6. **Strict Concurrency Governor**: Enforce a maximum of 8 concurrent coding workers in isolated Git worktrees.
7. **Human Approval Gates**: Production deployments and destructive database migrations strictly require explicit operator authorization.

---

## Swarm Workflow Lifecycle

```
[User Request / Feature Need]
       │
       ▼
1. Discovery & BA ──► BA inspects navigation, roles, and codebase.
                      Presents proposal with recommended defaults.
                      Awaits operator confirmation on material requirements.
       │
       ▼
2. R&D & UI/UX    ──► R&D proposes essential vs optional improvements.
                      UI/UX Design Engineer crafts interaction plan & state matrix.
       │
       ▼
3. Architecture   ──► Architect establishes API schemas and legacy migration boundaries.
                      Builds baseline regression tests if legacy code is affected.
       │
       ▼
4. Execution      ──► Dispatch ready tasks to Workers (max 8 concurrent in worktrees).
       │
       ▼
5. Review & QA    ──► Review & Assembly Engineer checks contracts and merges branches.
                      QA runs targeted, regression, and E2E Playwright tests.
                      Actions Watcher monitors CI and auto-routes defects (max 3 retries).
       │
       ▼
6. Staging & Gate ──► VM Fleet Handler deploys to staging and verifies health.
                      Security Gate audits release candidate ──► Human Approval for Prod.
```

---

## Agent Hierarchy (18 Specialized Roles)

- **Strategy & Analysis**: Chief Orchestrator (Leader), Project Manager, Product Analyst / Business Analyst, Thought / R&D Engineer, UI/UX Design Engineer, Chief Architect.
- **Implementation Specialists**: Senior Engineer 1 (Backend & Architecture Core), Senior Engineer 2 (Frontend & System Integration), Junior Engineers 1, 2, 3 (Scoped Features/UI/Regressions), Dynamic Coding Workers (Pool of up to 8 concurrent).
- **Quality & Operations**: Automation/DevOps Engineer, GitHub Actions Watcher, QA / Human Simulation Engineer, VM Fleet Handler, Review & Assembly Engineer, Security / Release Gate.

For comprehensive role instructions, consult [Agent Roles Reference](./references/agent_roles.md).

---

## Detailed References & Templates

- [Agent Roles & Responsibilities Reference](./references/agent_roles.md)
- [Legacy Codebase Modernization & Regression Protection](./references/legacy_modernization.md)
- [UI/UX Quality Gate & Standards](./references/ui_ux_quality_gate.md)
- [Task Orchestration & State Machine Rules](./references/orchestration_rules.md)
- [Agent Task Contract Specifications](./references/task_contracts.md)
- [Recovery, Reliability & Retry Budgets](./references/recovery_and_reliability.md)
- [Security, Secret Redaction & Approval Policies](./references/security_and_approval.md)
- [BA Requirement Proposal Template](./resources/templates/ba_proposal.md)
- [R&D Technical Suggestions Template](./resources/templates/rd_proposal.md)
- [UI/UX Interaction Spec Template](./resources/templates/ui_ux_spec.md)
- [Legacy Migration Plan Template](./resources/templates/legacy_migration_plan.md)
- [Task Plan Template](./resources/templates/task_plan.md)
- [Agent Contract Template](./resources/templates/agent_contract.json)
- [Review Report Template](./resources/templates/review_report.md)
- [Defect Report Template](./resources/templates/defect_report.md)
- [Release Checklist Template](./resources/templates/release_checklist.md)
- [Deployment Manifest Template](./resources/templates/deployment_manifest.json)
