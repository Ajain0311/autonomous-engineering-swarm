# Security, Secret Redaction & Human Approval Policies

## 1. Zero Secret Exposure Guarantee

1. **Automatic Redaction Filter**:
   - All logs, stdout, error traces, and UI dashboard responses pass through an automated secret filter.
   - Patterns matching API keys (GitHub tokens, AWS keys, Stripe secrets, JWTs, private SSH keys, password strings) are replaced with `[REDACTED_SECRET]`.
2. **Environment Isolation**:
   - Workers never receive raw credentials in task prompts or contract payloads.
   - System relies on environment variables injected at runtime or scoped least-privilege tokens.

---

## 2. Gated Human Approvals

The following operations strictly require human approval:

1. **Production Deployments**:
   - Any release targeting a production VM or cluster must create an `ApprovalRequest` record in the database.
   - Required evidence before review:
     - Exact Git commit SHA & semantic version tag
     - Complete test suite execution report (unit, integration, QA E2E)
     - Artifact container digest or package hash
     - Staging smoke test verification proof
     - Documented automated rollback procedure
2. **Destructive Database Migrations**:
   - Any SQL migration with `DROP TABLE`, `DROP COLUMN`, `ALTER COLUMN TYPE`, or `TRUNCATE`.
   - Requires verified backward-compatible schema migration plan.
3. **VM Deletion & Firewall Changes**:
   - Destructive infrastructure alterations.

---

## 3. Git Branch Protection Compliance

- Workers must never push directly to `main` or protected branches.
- Workers push to dedicated task branches (`feat/task-<id>` or `fix/defect-<id>`).
- Review & Assembly Engineer creates Pull Requests and verifies required status checks before merging.
