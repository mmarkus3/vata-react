## Why

`app/product/[id].tsx` currently manages editable product fields with many independent `useState` hooks and imperative save-time validation, which makes edits harder to maintain and error-prone as fields evolve. We should adopt `react-hook-form` in product detail edit flow now to centralize field state, validation, and submission behavior while preserving existing image/barcode edit functionality.

## What Changes

- Replace text-field edit state in product detail page with a typed `react-hook-form` model.
- Move required and numeric/non-negative validation for editable product fields into declarative form rules.
- Keep existing save payload behavior for optional pricing and nutrition fields, including comma-decimal parsing.
- Preserve barcode image and product image edit flows and their integration with save operation.
- Keep localized user-facing validation and save errors in i18next-backed keys.

## Capabilities

### New Capabilities
- `react-hook-form-product-detail`: Declarative form state and validation for editing products in `app/product/[id].tsx`.

### Modified Capabilities
- `product-price-extensions`: Product edit pricing flow gains explicit form-driven validation for optional numeric price fields.
- `product-nutrition-management`: Product edit nutrition flow gains explicit form-driven validation for optional numeric nutrition fields.

## Impact

- Affected code: `app/product/[id].tsx`, optional extracted form helpers, and related tests.
- Dependencies: reuse existing `react-hook-form` dependency already present in the app.
- UX: validation behavior in edit mode becomes predictable and field-driven.
- Testing: update/add Jest coverage for product detail edit validation and payload mapping behavior.
