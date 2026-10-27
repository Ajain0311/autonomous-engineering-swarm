# Security & Release Gate Checklist: Release {{VERSION}}

## 1. Candidate Details
- **Release Version**: `{{VERSION}}`
- **Candidate Commit SHA**: `{{COMMIT_SHA}}`
- **Target Environment**: `[STAGING | PRODUCTION]`

---

## 2. Mandatory Verification Gates
- [ ] **Full Regression Suite**: All end-to-end tests passing without skips.
- [ ] **Static Secret Scan**: Zero high-entropy keys or plaintext credentials discovered.
- [ ] **Vulnerability Audit**: Zero HIGH or CRITICAL CVEs in dependencies.
- [ ] **Database Migration Safety**: Schema changes tested; rollback verified non-destructive.
- [ ] **Staging Verification**: Staging deployment verified with healthy smoke checks.

---

## 3. Human Approval Signoff
- [ ] Production Deployment Approved by Human Operator
- **Approver Signature / Timestamp**: `{{OPERATOR_SIGNATURE}}`
- **Approved Commit**: `{{COMMIT_SHA}}`
- **Rollback Digest**: `{{ROLLBACK_DIGEST}}`
