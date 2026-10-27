# Security Policy & Approval Governance

## 1. Zero Secret Exposure Guarantee
- Sensitive strings (tokens, private keys, passwords) are automatically intercepted and replaced with `[REDACTED_SECRET]` before persistence, logs, or UI transmission.
- Agents operate with environment-injected scoped tokens rather than hardcoded credentials.

## 2. Gated Human Approvals
The following actions cannot be executed autonomously:
- **Production Deployments**: Requires exact commit SHA, verified test artifacts, and verified rollback image digest.
- **Destructive Database Migrations**: Prohibits irreversible `DROP` commands without dual authorization.
- **VM Node Deletion / Firewall Modifications**: Guarded by the Human Approval Center.

## 3. Least-Privilege Branch Protection
- Workers push strictly to feature branches (`feat/task-<id>`).
- Direct pushes to `main` are prohibited.
- Review & Assembly Engineer validates interface compatibility and boundaries before merging.
