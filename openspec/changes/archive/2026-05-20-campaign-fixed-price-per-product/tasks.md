## 1. Form Model and Validation

- [x] 1.1 Extend campaign form state for per-product fixed price inputs keyed by product ID.
- [x] 1.2 Update create/edit validation to require valid fixed price per selected product in fixed mode.
- [x] 1.3 Update payload builder to persist per-product `discountFixed` values.

## 2. Create/Edit Modal UI

- [x] 2.1 Add per-product fixed price input controls to campaign create modal in fixed mode.
- [x] 2.2 Add per-product fixed price input controls to dedicated campaign edit modal in fixed mode.
- [x] 2.3 Ensure edit modal prefills per-product fixed price values from existing campaign data.

## 3. State Sync and UX

- [x] 3.1 Keep per-product fixed-price state synchronized with product selection changes.
- [x] 3.2 Show clear error feedback for missing/invalid per-product fixed values.

## 4. Verification

- [x] 4.1 Add/update unit tests for per-product fixed price validation and payload mapping.
- [x] 4.2 Add/update tests for edit prefill and per-product fixed price update flow.
- [x] 4.3 Run targeted campaign create/edit/detail tests and resolve regressions.
