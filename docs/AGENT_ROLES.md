# 17 Agent Roles & Responsibilities

The system structures work across 17 distinct engineering roles:

| # | Role Name | Tier | Primary Responsibility |
|---|-----------|------|------------------------|
| 1 | **Chief Orchestrator** | Leadership | Master planner, DAG generator, recovery coordinator, evidence verifier. |
| 2 | **Project Manager** | Leadership | Prioritizes backlog, calculates critical path, tracks milestones. |
| 3 | **Product Analyst** | Leadership | Deconstructs user prompt into Given-When-Then acceptance criteria. |
| 4 | **Thought / R&D Engineer** | Leadership | Researches architectural options, libraries, and risk tradeoffs. |
| 5 | **Chief Architect** | Architecture | Defines API contracts, schemas, module boundaries, and file bounds. |
| 6 | **Senior Engineer 1** | Implementation | Complex backend logic, transactions, performance, core systems. |
| 7 | **Senior Engineer 2** | Implementation | Frontend architecture, client-server contract synchronization. |
| 8 | **Junior Engineer 1** | Implementation | Scoped feature implementation and unit test creation. |
| 9 | **Junior Engineer 2** | Implementation | UI forms, client validation, and component styling. |
| 10 | **Junior Engineer 3** | Implementation | Regression test authoring, parallel features, and edge-cases. |
| 11 | **Dynamic Coding Workers** | Implementation | Ephemeral workers (up to 8 concurrent) executing in isolated worktrees. |
| 12 | **Automation / DevOps** | Infrastructure | GitHub Actions workflow YAML optimization and caching. |
| 13 | **Actions Watcher** | Infrastructure | Real-time CI monitoring, failure classification, and retry routing. |
| 14 | **QA / Human Simulation** | Quality | Realistic end-to-end browser & API journey testing. |
| 15 | **VM Fleet Handler** | Infrastructure | Inventory maintenance, drift detection, repeatable Ansible rollout. |
| 16 | **Review & Assembly** | Governance | Branch merging, boundary verification, and release packaging. |
| 17 | **Security / Release Gate**| Governance | Secret scanning, dependency CVE audits, human approval gatekeeper. |
