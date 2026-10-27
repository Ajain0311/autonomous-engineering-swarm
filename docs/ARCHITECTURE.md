# System Architecture: Autonomous Engineering Swarm

The Autonomous Engineering Swarm is an enterprise-grade agentic operating system designed to automate software engineering lifecycles with deterministic controls, evidence verification, strict concurrency limits, and human approval gates.

```
                      ┌────────────────────────┐
                      │    User Instruction    │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │   Chief Orchestrator   │
                      │  & Lead Architecture   │
                      └───────────┬────────────┘
                                  │
                       Generates Task DAG & Contracts
                                  │
                                  ▼
           ┌──────────────────────────────────────────────┐
           │      Topological Concurrency Governor        │
           │        (Strict Limit: 8 Workers)             │
           └──────┬───────────────┬──────────────┬────────┘
                  │               │              │
                  ▼               ▼              ▼
           ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
           │ Worktree 1  │ │ Worktree 2  │ │ Worktree 3  │ (Max 8 concurrent)
           └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
                  │               │              │
                  └───────────────┼──────────────┘
                                  │ Structured Evidence
                                  ▼
                      ┌────────────────────────┐
                      │   Review & Assembly    │
                      │  Interface Verification│
                      └───────────┬────────────┘
                                  │ Merged Branch
                                  ▼
                      ┌────────────────────────┐
                      │   QA Simulation &      │◄── (Defect? Route to Worker,
                      │  GitHub Actions Watcher│     Max 3 Retries)
                      └───────────┬────────────┘
                                  │ All Checks Pass
                                  ▼
                      ┌────────────────────────┐
                      │   Staging VM Deploy    │
                      │ & Automated Smoke Test │
                      └───────────┬────────────┘
                                  │ Smoke Test 200 OK
                                  ▼
                      ┌────────────────────────┐
                      │ Security Release Gate  │
                      │   & Human Approval     │
                      └───────────┬────────────┘
                                  │ Explicit Human Signoff
                                  ▼
                      ┌────────────────────────┐
                      │ Production Rollout     │
                      └────────────────────────┘
```

## Architectural Pillars

1. **State Machine & Durable Persistence**:
   Tasks transition through deterministic states (`PLANNED`, `READY`, `IN_PROGRESS`, `REVIEW`, `TESTING`, `READY_TO_RELEASE`, `VERIFIED`). Any direct jump to `VERIFIED` without verifiable commit and test evidence is programmatically rejected.

2. **Concurrency Governor (Max 8 Workers)**:
   An asyncio semaphore guarantees that no more than 8 coding workers can execute in parallel, preventing workspace contention and API exhaustion.

3. **Git Worktree Isolation**:
   Workers operate in isolated worktrees (`git worktree add`), ensuring parallel edits do not corrupt working trees.

4. **Reliability & Retry Budget**:
   Defects are capped at 3 retries. Repeated failures trigger automatic dead-letter queue escalation to prevent infinite loops.

5. **Security Redaction & Human Approvals**:
   Secrets (GitHub tokens, SSH keys, passwords) are automatically redacted in memory. Production releases and destructive operations require human signoff with verified rollback plans.
