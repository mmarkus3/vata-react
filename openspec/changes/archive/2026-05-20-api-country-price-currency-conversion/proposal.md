## Why

Product prices are currently returned only in EUR, but companies may operate in multiple countries. Backend should return prices in country-specific currency so clients display the correct local price without duplicating conversion logic.

## What Changes

- Keep EUR as default response currency for product prices.
- If company country is `SE`, convert returned product prices to SEK using currency `getRate`.
- Apply conversion consistently to product price fields exposed by product APIs.
- Preserve safe fallback behavior if conversion rate is unavailable.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `product-price-extensions`: Extend backend product pricing response behavior to return country-aware currency values (EUR default, SEK for `SE` via `getRate`).

## Impact

- Backend product service price mapping for list/detail endpoints.
- Currency conversion utility/service integration (`getRate`).
- Backend tests for EUR default, SE conversion, and fallback behavior.
