## 1. Extract Assignment Module

- [x] 1.1 Create dedicated assignment component/file(s) for category product assignment modal UI.
- [x] 1.2 Move assignment selection/mutation/loading/error state handling out of `app/category/[id].tsx` into the new module.
- [x] 1.3 Replace inline assignment modal block in category detail with module integration via props/callbacks.

## 2. Add Product Filtering

- [x] 2.1 Add filter input state and UI to assignment flow.
- [x] 2.2 Implement filtering logic for candidate products (name-based match at minimum).
- [x] 2.3 Ensure filtering works together with already-assigned exclusion and selection behavior.

## 3. Preserve Behavior and UX

- [x] 3.1 Keep duplicate-submit prevention while assignment is in progress.
- [x] 3.2 Keep success/error feedback and assignment reset behavior after completion.
- [x] 3.3 Confirm category detail edit/delete and assigned-product navigation remain unchanged.

## 4. Verification

- [x] 4.1 Add/update unit tests for filtering helpers and assignment state logic.
- [x] 4.2 Add/update tests for extracted assignment module interaction contract.
- [x] 4.3 Run targeted category/product test suites and resolve regressions.
