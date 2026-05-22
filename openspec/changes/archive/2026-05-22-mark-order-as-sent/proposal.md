## Why

Users need a clear operational action to mark fulfilled orders as `sent`. Without a dedicated status transition, shipping workflow tracking remains manual and inconsistent.

## What Changes

- Add user action to mark an order status as `sent`.
- Persist status change through backend order update endpoint.
- Reflect updated status immediately in order detail and orders list segments.
- Prevent invalid transitions where applicable (e.g. missing order or company mismatch).

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `orders-tab-order-list`: Extend order detail/list workflow to allow marking an order as `sent` and reflecting status updates.
- `order-placement-product-validation`: Clarify backend order update behavior for status transition to `sent` and validation constraints.

## Impact

- Frontend order detail action UI and state refresh.
- Backend order patch/update path for status-only transition.
- Tests for successful sent transition and error handling.
