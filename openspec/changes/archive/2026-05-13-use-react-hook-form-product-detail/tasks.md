## 1. Form Foundation in Product Detail

- [x] 1.1 Define typed form values/defaults for editable scalar product fields in `app/product/[id].tsx`.
- [x] 1.2 Wire `useForm` and `Controller` into edit-mode inputs, replacing per-field text `useState` bindings.
- [x] 1.3 Reset form values from fetched product data so edit mode always reflects latest persisted values.

## 2. Validation and Save Flow Migration

- [x] 2.1 Move required and numeric/non-negative edit validation rules into `react-hook-form` field rules.
- [x] 2.2 Refactor save handler to use `handleSubmit` while preserving current payload parsing for optional price/nutrition values.
- [x] 2.3 Keep barcode/product image state integration and upload progress behavior unchanged in update submission.

## 3. Localization and Regression Coverage

- [x] 3.1 Ensure validation and save error messages remain localized with `productDetail.errors.*` keys.
- [x] 3.2 Verify edit lifecycle parity (loading/saving states, successful refresh, edit-mode exit, error retention on failure).
- [x] 3.3 Add or update Jest tests for product detail edit validation and payload mapping for pricing/nutrition updates.
