## 1. Dependency and Form Scaffolding

- [x] 1.1 Verify `react-hook-form` is available in project dependencies and add it if missing.
- [x] 1.2 Define typed `AddProductModal` form values and defaults for all text-based product fields.
- [x] 1.3 Replace per-field `useState` bindings with `useForm`/`Controller` wiring for modal `TextInput` fields.

## 2. Validation and Submission Migration

- [x] 2.1 Move required field and numeric/non-negative validation rules into `react-hook-form` field rules.
- [x] 2.2 Refactor submit handling to use `handleSubmit` and keep existing parsing for optional price/nutrition values.
- [x] 2.3 Preserve existing product creation payload contract and integrate current image/link state into the new submit path.

## 3. UX, Localization, and Regression Coverage

- [x] 3.1 Ensure validation errors shown to users are localized through i18next keys and remain consistent with modal UX.
- [x] 3.2 Keep success/failure/loading behavior unchanged (API call, reset state, callbacks, modal close).
- [x] 3.3 Add or update Jest tests for required-field validation, optional pricing validation, and successful submit payload mapping.
