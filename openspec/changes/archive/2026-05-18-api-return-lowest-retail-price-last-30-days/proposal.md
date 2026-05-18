## Why

Client applications need `lowestRetailPriceLast30Days` directly from backend product responses so pricing-compliance messaging is consistent and does not depend on duplicated client-side calculations. Returning this value from API-backed product reads centralizes correctness and reduces frontend logic drift.

## What Changes

- Require product backend/API read responses to include `lowestRetailPriceLast30Days` for products.
- Define fallback behavior when 30-day price history is missing or insufficient.
- Ensure product list/detail consumers receive the field through existing product retrieval endpoints.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `product-price-extensions`: Extend product read requirements so backend/API responses include `lowestRetailPriceLast30Days`.

## Impact

- Affected code likely includes product service/read mapping and any API handlers exposing product payloads.
- Product response contract changes for clients consuming product data.
- Test coverage should verify field presence and fallback behavior in API/read responses.
