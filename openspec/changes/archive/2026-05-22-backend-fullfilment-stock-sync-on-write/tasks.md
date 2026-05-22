## 1. Shared stock utility extraction

- [x] 1.1 Extract paid-order stock calculation/validation helpers into common backend module.
- [x] 1.2 Refactor paid-order trigger flow to use shared stock utility module without behavior change.

## 2. Backend fullfilment write trigger

- [x] 2.1 Add `onDocumentWritten('/fullfilments/{id}')` trigger for stock synchronization.
- [x] 2.2 Implement delta-based stock adjustment for create/update/delete fullfilment writes.
- [x] 2.3 Apply stock updates in atomic transaction with existence/amount validation.

## 3. Remove client-side stock mutation responsibility

- [x] 3.1 Refactor/remove frontend/service fullfilment stock update logic so backend trigger is source of truth.
- [x] 3.2 Ensure no duplicate stock updates occur after migration.

## 4. Verification

- [x] 4.1 Add/update tests for shared stock utility behavior used by both order and fullfilment flows.
- [x] 4.2 Add/update tests for fullfilment create/update/delete stock sync and rollback cases.
- [x] 4.3 Run targeted backend/frontend test suites covering order and fullfilment stock behavior.
