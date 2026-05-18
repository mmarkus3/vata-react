## Why

`placeOrder` can currently proceed without guaranteeing that every ordered product still exists and has sufficient stock at commit time. This risks accepting orders that cannot be fulfilled and can lead to inventory inconsistencies.

## What Changes

- Add backend validation in `functions/src/orders/orders.service.ts` `placeOrder` flow to verify each ordered product exists.
- Add backend validation to ensure each ordered product has enough current stock amount before placing the order.
- Reject order placement with clear errors when any product is missing or stock is insufficient.

## Capabilities

### New Capabilities
- `order-placement-product-validation`: Enforce product existence and stock-availability checks during order placement.

### Modified Capabilities
- None.

## Impact

- Affected code: `functions/src/orders/orders.service.ts` and related order tests.
- API behavior: `placeOrder` may return validation errors for missing products or insufficient stock.
- Data integrity: prevents invalid order state transitions when stock conditions are not met.
