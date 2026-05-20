## Why

Delivery fee and free-delivery threshold are currently returned in default currency values, which can mismatch local country pricing expectations. Backend should return these values in country-specific currency so clients don’t need duplicate conversion logic.

## What Changes

- Update backend `getPrices` function to return delivery price and free-delivery threshold in country-aware currency.
- Keep EUR as default response currency.
- If country is `SE`, convert both values to SEK using currency `getRate`.
- Preserve safe fallback to EUR values when rate lookup is unavailable.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `orders-tab-order-list`: Extend backend order pricing metadata response behavior so `delivery` and `over` (free-delivery threshold) are country-aware (EUR default, SEK for `SE` via `getRate`).

## Impact

- Backend `functions/src/orders/orders.service.ts` (`getPrices`) behavior.
- Currency conversion integration using `functions/src/currency/currency.ts#getRate`.
- Backend tests for EUR default, SE conversion, and conversion fallback behavior.
