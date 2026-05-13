## 1. Category Data Integration

- [x] 1.1 Load category options for product create and edit flows from existing category source.
- [x] 1.2 Define shared selector option mapping and fallback handling for stale saved category values.
- [x] 1.3 Add localized labels/placeholders/messages needed for category selector UX in both forms.

## 2. Product Create and Edit Form Updates

- [x] 2.1 Add optional category selector to `AddProductModal` and bind it to react-hook-form state.
- [x] 2.2 Add optional category selector to `app/product/[id].tsx` edit form and preload current category.
- [x] 2.3 Include selected category in create/update payload mapping while preserving current validation and media workflows.

## 3. Validation and Regression Coverage

- [x] 3.1 Ensure selector behavior remains stable when category list is empty/loading or missing product's saved category.
- [x] 3.2 Add or update Jest tests for create and edit payloads including category selection and stale-value handling.
- [x] 3.3 Verify existing product create/edit success and error lifecycle behavior remains unchanged after category integration.
