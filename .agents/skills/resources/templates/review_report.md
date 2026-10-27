# Review & Assembly Report: {{TASK_ID}}

## 1. Metadata
- **Task ID**: {{TASK_ID}}
- **Author Role**: {{WORKER_ROLE}}
- **Branch**: `{{SOURCE_BRANCH}}` -> `{{TARGET_BRANCH}}`
- **Commit SHA**: `{{COMMIT_SHA}}`

---

## 2. Boundary & Security Check
- [ ] **File Boundary Audit**: All modified files match `allowed_file_patterns`.
- [ ] **Secret Check**: No unredacted passwords, keys, or tokens in diff.
- [ ] **Clean Lint**: Code passes repo linter and format checks without suppression.

---

## 3. Interface & Contract Verification
- [ ] Exported functions / API routes match the Architectural specification.
- [ ] Backward compatibility maintained for shared interfaces.

---

## 4. Test Verification Summary
- **Verification Command**: `{{TEST_COMMAND}}`
- **Exit Code**: `{{EXIT_CODE}}` (Must be 0)
- **Tests Passed**: `{{TESTS_PASSED}}` / `{{TOTAL_TESTS}}`

---

## 5. Review Verdict
- [ ] **APPROVED**: Ready for merge and QA integration suite.
- [ ] **CHANGES REQUESTED**: Routing defect task back to worker.
