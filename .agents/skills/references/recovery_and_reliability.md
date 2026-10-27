# Recovery, Reliability & Retry Budgets

## 1. Retry Budget & Escalation Strategy

1. **Max 3 Retries per Defect**:
   - Defect Attempt 1: Worker receives test failure logs + stack trace and attempts targeted fix.
   - Defect Attempt 2: If failure recurs, Thought / R&D Engineer performs diagnostic analysis, recommends alternate strategy, and worker executes.
   - Defect Attempt 3: Senior Engineer takes over task for final recovery attempt.
   - Defect Attempt > 3: Task transitions to `FAILED` and enters the **Dead-Letter Queue**. The Chief Orchestrator flags a blocking human escalation.

2. **Exponential Backoff for Transient Failures**:
   - For network hiccups, rate limits, or CI polling delays: wait $2^n \times 1.5$ seconds (e.g., 3s, 6s, 12s) before retry.

3. **Independent Task Non-Blocking**:
   - If Task A fails, independent Task B continues execution unhindered.
   - Only tasks directly downstream of Task A in the DAG are placed into `BLOCKED`.

---

## 2. Orchestrator Crash & Restart Recovery

- The Orchestrator persists all task state transitions, active leases, and worker assignments into durable storage (SQLite / PostgreSQL).
- On process startup:
  1. Inspects database for tasks marked `IN_PROGRESS`.
  2. Verifies worker health / task lease expiration (default lease: 10 minutes).
  3. Reclaims orphaned leases, transitions tasks back to `READY` or prompts worker reconnection.
  4. Resumes DAG evaluation without losing prior completed tasks.

---

## 3. Global Kill Switch & Emergency Stop

- An emergency kill switch is provided via API and Dashboard UI (`POST /api/system/kill-switch`).
- Triggering the kill switch:
  - Immediately signals all active workers to abort running commands.
  - Revokes all active worktree locks.
  - Cancels pending staging/production deployment dispatches.
  - Transitions the swarm into `PAUSED` or `HALTED` state until manual operator reset.
