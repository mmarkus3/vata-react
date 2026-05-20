## 1. Form State and Actions

- [x] 1.1 Extend campaign create/edit form state with shared bulk fixed-price input value for fixed mode.
- [x] 1.2 Add form action/helper to apply shared bulk fixed-price value to all currently targeted product IDs.
- [x] 1.3 Preserve per-product values as canonical payload/validation source and keep targeting-sync cleanup behavior.

## 2. Create/Edit Modal UI

- [x] 2.1 Add bulk fixed-price input and explicit apply action to campaign create modal in fixed mode.
- [x] 2.2 Add bulk fixed-price input and explicit apply action to campaign edit modal in fixed mode.
- [x] 2.3 Ensure per-product inputs remain visible and editable after bulk apply in both modals.

## 3. Validation and UX Behavior

- [x] 3.1 Keep save validation based on per-product fixed values after bulk apply.
- [x] 3.2 Show invalid-value feedback when bulk value is missing/invalid at apply or save time.
- [x] 3.3 Ensure manual per-product overrides persist unless bulk apply is invoked again.

## 4. Verification

- [x] 4.1 Add/update unit tests for bulk-apply helper behavior across selected/all/category targeting.
- [x] 4.2 Add/update create/edit form tests for bulk apply + per-product override flows.
- [x] 4.3 Run targeted campaign tests and resolve regressions.
