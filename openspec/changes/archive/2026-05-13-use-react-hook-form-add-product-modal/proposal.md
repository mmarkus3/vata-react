## Why

`AddProductModal` currently manages every field with separate `useState` hooks and manual validation branches, which makes the form hard to maintain and easy to regress as fields evolve. We should move to `react-hook-form` now to centralize validation and field state while keeping the existing product creation behavior stable.

## What Changes

- Replace per-field `useState` form state in `AddProductModal` with a `react-hook-form` form model.
- Define validation rules for required, numeric, and non-negative fields in the form configuration instead of ad-hoc imperative checks.
- Keep existing payload shaping for optional price and nutrition fields, including comma-to-decimal parsing.
- Preserve image/link selection flows and submit lifecycle (`loading`, API call, reset, close) while integrating them with form submit handling.
- Route user-facing validation feedback through localized i18next keys.

## Capabilities

### New Capabilities
- `react-hook-form-product-modal`: Standardized form state and validation handling for product creation in modal UIs.

### Modified Capabilities
- `product-price-extensions`: Product creation form validation and submission behavior is redefined to be form-driven while preserving existing pricing and nutrition constraints.

## Impact

- Affected code: `components/home/AddProductModal.tsx` and possibly related shared input/validation helpers.
- Dependencies: adds/uses `react-hook-form` in the app runtime if not already present.
- UX: validation error timing and rendering become declarative, reducing inconsistent error handling.
- Testing: Jest tests around modal validation and submit payload should be updated/added.
