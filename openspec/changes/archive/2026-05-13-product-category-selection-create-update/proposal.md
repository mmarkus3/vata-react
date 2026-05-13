## Why

Products currently have a `category` field in the model, but create and update flows do not consistently let users pick and save category values. Users should be able to assign or change category directly while creating or editing products so product metadata stays complete and maintainable.

## What Changes

- Add category selection to product creation flow (`AddProductModal`) using available category data.
- Add category selection to product update flow (`app/product/[id].tsx`) and persist category edits on save.
- Ensure create/update payload mapping includes selected category value when provided.
- Define behavior for empty category and previously saved category values that may no longer exist.
- Keep category labels and validation/error messaging localized via i18next.

## Capabilities

### New Capabilities
- `product-category-assignment`: Category selection and persistence behavior for product create and edit flows.

### Modified Capabilities
- `react-hook-form-product-modal`: Product create form requirements expand to include category selection field behavior.
- `react-hook-form-product-detail`: Product detail edit form requirements expand to include category selection field behavior.

## Impact

- Affected code: `components/home/AddProductModal.tsx`, `app/product/[id].tsx`, category data hooks/services usage, and related tests.
- Data contract: product `category` value becomes explicitly user-settable in both create and edit submissions.
- UX: users can manage product category without leaving create/edit forms.
- Testing: add/update Jest coverage for category selection defaults, changes, and payload persistence.
