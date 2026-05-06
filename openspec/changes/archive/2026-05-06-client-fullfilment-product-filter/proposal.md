## Why

Users creating a fullfilment for a client often need to pick from products already used for that client, but they occasionally need to access the full product catalog. A clear filter with a sensible default reduces selection noise while keeping flexibility.

## What Changes

- Add product source selection in the add fullfilment flow: `Kaupan tuotteet` or `Kaikki tuotteet`.
- Default source to `Kaupan tuotteet` (products already present in that client's historical fullfilments).
- Allow switching to `Kaikki tuotteet` to show all company products.
- Keep existing validation, submission, and inventory deduction behavior unchanged.

## Capabilities

### New Capabilities
- `client-product-source-filter`: Product source filtering for client fullfilment creation.

### Modified Capabilities
- `client-detail`: Fullfilment creation modal product selection behavior is expanded with source filter and default mode.

## Impact

- Affects `components/clients/AddFullfilmentModal.tsx`.
- Affects data-loading logic in `services/fullfliment.ts` and/or product retrieval helper usage.
- May require deriving unique product IDs from existing client fullfilments.
- Requires tests for source toggle behavior and default state.
