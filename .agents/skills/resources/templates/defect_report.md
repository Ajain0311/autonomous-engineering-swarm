# Defect Report: DEF-{{DEFECT_ID}}

## 1. Defect Overview
- **Originating Task**: {{TASK_ID}}
- **Reported By**: {{DETECTING_AGENT}} (QA Engineer / GitHub Actions Watcher)
- **Failure Classification**: `[CODE_ERROR | DEPENDENCY | FLAKY_TEST | INFRASTRUCTURE]`
- **Retry Attempt**: {{CURRENT_ATTEMPT}} / 3

---

## 2. Failure Diagnostic & Evidence
- **Failed Step / Journey**: {{FAILED_STEP}}
- **Exit Code**: {{EXIT_CODE}}
- **Log Excerpt / Stack Trace**:
```text
{{FAILURE_LOG_OUTPUT}}
```

---

## 3. Reproduction Steps
1. Checkout commit `{{COMMIT_SHA}}`
2. Run test command: `{{REPRO_COMMAND}}`
3. Observe failure at assertion `{{ASSERTION_DETAILS}}`

---

## 4. Remediation Assignment
- **Assigned Worker**: {{ASSIGNED_ROLE}}
- **Required Resolution**: Resolve assertion failure and re-run test suite until green.
