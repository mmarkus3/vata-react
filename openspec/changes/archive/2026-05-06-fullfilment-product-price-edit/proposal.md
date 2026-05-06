## Why

Product prices can vary per delivery context, but current fullfilment creation uses only the stored product price without transparent review or adjustment. Users need to see the current price and optionally edit it for that specific fullfilment item.

## What Changes

- Show product price when selecting products in add fullfilment modal.
- Allow editing per-item price before adding product to the fullfilment list.
- Persist the selected/edited price into fullfilment product payload.
- Keep amount validation and stock deduction behavior unchanged.

## Capabilities

### New Capabilities
- `fullfilment-line-price-edit`: Per-line price visibility and override in fullfilment creation.

### Modified Capabilities
- `client-detail`: Fullfilment creation modal behavior expands to include price preview and editable price input.
- `fullfilment-storage-sync`: Fullfilment product line data now records edited price when provided.

## Impact

- Affects `components/clients/AddFullfilmentModal.tsx` UI and form state.
- Affects fullfilment creation payload generation in `services/fullfliment.ts` call path.
- May affect downstream reporting that reads `fullfilment.products[].product.price`.
- Requires tests for default price, edited price, and validation scenarios.
