# Task Orchestration & State Machine Rules

## 1. Lifecycle State Machine

The engineering swarm enforces strict, deterministic state transitions:

```
                  ┌──────────────┐
                  │   PLANNED    │
                  └──────┬───────┘
                         │ Dependencies satisfied
                         ▼
                  ┌──────────────┐
                  │    READY     │
                  └──────┬───────┘
                         │ Worker assigned & leased
                         ▼
                  ┌──────────────┐
                  │ IN_PROGRESS  │◄─────────────┐
                  └──────┬───────┘              │
                         │ Worker commits changes│ Defect retry
                         ▼                      │ (max 3)
                  ┌──────────────┐              │
                  │    REVIEW    │              │
                  └──────┬───────┘              │
                         │ Assembly verified    │
                         ▼                      │
                  ┌──────────────┐              │
                  │   TESTING    │──────────────┘
                  └──────┬───────┘
                         │ Tests pass & artifacts verified
                         ▼
               ┌──────────────────┐
               │ READY_TO_RELEASE │ (Requires Human Approval if Prod)
               └─────────┬────────┘
                         │ Verified / Approved
                         ▼
                  ┌──────────────┐
                  │   VERIFIED   │
                  └──────────────┘

Terminal / Exceptional States:
- BLOCKED: Missing upstream dependencies, missing credentials, or unresolvable conflict.
- FAILED: Retries exhausted (>3), fatal build error, or rejected by Security Gate.
- CANCELLED: Terminated by Orchestrator or User via Kill Switch.
```

### Transition Validation Rules
- **No Direct Jump to VERIFIED**: Tasks can never transition directly from `PLANNED` or `IN_PROGRESS` to `VERIFIED`.
- **Evidence Requirement**: Moving from `TESTING` to `VERIFIED` requires:
  - Git commit hash of merged branch
  - Exit code `0` from verification command
  - Generated test artifact or stdout log
  - Verified acceptance criteria checklist

---

## 2. Dependency Graph (DAG) Execution

1. **Cycle Detection**: Any cyclic dependency in the task plan must be detected prior to dispatch. If a cycle is detected, the plan is rejected back to the Architect.
2. **Topological Scheduling**: Tasks with zero unmet dependencies immediately transition from `PLANNED` to `READY`.
3. **Parallel Dispatch**: The Orchestrator schedules all `READY` tasks simultaneously, subject to the concurrency throttle.
4. **Dynamic Concurrency Governor**:
   - Hard upper limit: **8 concurrent coding workers**.
   - If 12 tasks are `READY`, exactly 8 are dispatched to available worker slots; 4 remain queued in `READY`.
   - As workers finish, queued tasks are immediately allocated.

---

## 3. Worker Isolation via Git Worktrees

To prevent merge collision and workspace contention:
1. Each active coding task creates an isolated worktree:
   ```bash
   git worktree add -b swarm/<task-id> .worktrees/<task-id> origin/main
   ```
2. Worker performs file edits and runs localized tests strictly inside `.worktrees/<task-id>`.
3. Worker pushes branch and deletes worktree:
   ```bash
   git worktree remove --force .worktrees/<task-id>
   ```
4. Assembly Engineer checks out the branch, verifies file boundaries, and integrates into the main candidate branch.
