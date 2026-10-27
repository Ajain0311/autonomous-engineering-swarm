# Troubleshooting & Recovery Guide

## 1. Process Crash & Orchestrator Restart
If the orchestrator process terminates unexpectedly:
1. Restart the orchestrator service (`scripts/run-all.ps1` or `docker-compose up`).
2. The orchestrator automatically invokes `recover_from_crash()` upon startup.
3. Any tasks that were `IN_PROGRESS` or `REVIEW` are safely restored to `READY` status.
4. Active leases are reclaimed, and DAG execution resumes without losing prior completed progress.

## 2. Defect Exhaustion (Dead-Letter Queue)
When a task fails after 3 retry attempts:
1. Status transitions to `FAILED`.
2. Inspect failure diagnostic logs via the dashboard Task Detail Modal.
3. Resolve root cause (e.g. adjust acceptance criteria or fix external dependency).
4. Click **Retry Task** in the UI to reset retries and requeue the task.

## 3. Emergency Kill Switch
If rogue agent behavior or unexpected deployment is detected:
1. Click the red **Kill Switch** button in the dashboard or POST `/api/system/kill-switch`.
2. All running workers and pending dispatches halt immediately.
3. Review audit logs (`/api/audit-logs`) to diagnose the event before resetting.
