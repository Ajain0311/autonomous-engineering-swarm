# Legacy Controller Refactoring & Migration Plan: {{CONTROLLER_NAME}}

## 1. Current State Assessment
- **Controller File**: `{{CONTROLLER_PATH}}`
- **Lines of Code**: {{LOC}}
- **Existing API Routes**:
  - `[GET] /api/{{ROUTE_1}}`
  - `[POST] /api/{{ROUTE_2}}`
- **Embedded Responsibilities**: Direct database queries, manual authorization, business validations, external calls.

---

## 2. Regression Protection Baseline
- [ ] **Baseline Test Suite**: Authored integration tests in `{{TEST_PATH}}`.
- [ ] **Contract Invariance**: Recorded request/response snapshots for all existing routes.
- [ ] **Pre-Refactoring Verification**: `{{TEST_COMMAND}}` passes 100% green.

---

## 3. Incremental Extraction Plan
1. **Step 1 - Domain Model**: Extract business entities and validation rules to `Models/` or `Domain/`.
2. **Step 2 - Service Layer**: Create `{{SERVICE_NAME}}` containing business workflows.
3. **Step 3 - Repository / Data Access**: Encapsulate persistence logic.
4. **Step 4 - Controller Slimming**: Delegate controller endpoints to the new Service layer.
5. **Step 5 - Dual Verification**: Run regression tests to verify exact behavior preservation.
