## Why

The backend API currently returns product pricing fields but does not guarantee `lowestRetailPriceLast30Days` in responses from `functions/src/products/products.service.ts`. Moving this calculation to backend responses (matching existing React-side logic) ensures all API consumers get consistent compliance-related pricing data.

## What Changes

- Update backend product response mapping in `functions/src/products/products.service.ts` to include `lowestRetailPriceLast30Days`.
- Copy/adapt the existing React-side 30-day lowest retail price calculation to backend service logic.
- Ensure both product list and single-product API responses include `lowestRetailPriceLast30Days` with null fallback when not computable.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `product-price-extensions`: Extend backend/API response requirements so product responses from functions service include `lowestRetailPriceLast30Days` using the shared 30-day calculation behavior.

## Impact

- Affected code: `functions/src/products/products.service.ts` and related product types/tests in `functions/`.
- API contract: product response payload gains/guarantees `lowestRetailPriceLast30Days`.
- Testing: add/update backend product service tests for list/detail and null fallback behavior.
