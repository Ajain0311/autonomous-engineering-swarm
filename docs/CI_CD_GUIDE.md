# CI/CD Automation & GitHub Sentinel Guide

The Swarm pairs an **Automation / DevOps Engineer** with an **Actions Watcher** to maintain GitHub Actions workflows.

## Failure Classification Engine

When a workflow job fails, the Actions Watcher inspects the log excerpt and classifies the failure into one of four categories:

1. **`CODE_ERROR`**:
   - Syntax errors, assertion failures, unhandled exceptions.
   - Routed back to the authoring Senior/Junior worker for targeted code correction.
2. **`DEPENDENCY`**:
   - `npm ERR! 404`, unresolved packages, lockfile checksum mismatches.
   - Routed to DevOps Engineer to refresh locks or update package manifests.
3. **`INFRASTRUCTURE`**:
   - Runner lost communication, out of disk, docker daemon unreachable.
   - Triggers exponential backoff and runner restart.
4. **`FLAKY`**:
   - Test timeouts on asynchronous locator / network races.
   - Reruns within retry budget before flagging defect.

## Webhook Ingestion
- Webhooks must be configured with HMAC SHA-256 signatures (`X-Hub-Signature-256`).
- Duplicate deliveries (`X-GitHub-Delivery`) are deduplicated in memory to avoid redundant task dispatches.
