## Why

Paid orders represent committed sales, so product stock should be reduced at that point to keep inventory accurate. Without this decrement, storage amounts drift from reality and can cause overselling and incorrect fulfillment planning.

## What Changes

- Add backend logic to reduce product stock when an order transitions to `paid`.
- Decrement each referenced product by ordered amount.
- Ensure stock updates happen safely and only once per order payment transition.
- Prevent partial inventory updates when any product decrement fails.

## Capabilities

### New Capabilities
- `paid-order-stock-decrement`: Inventory synchronization workflow that applies product stock decrements on paid-order transition.

### Modified Capabilities
- `order-sent-mail-trigger`: Existing `orders/{orderId}` update trigger behavior is extended to include inventory side effects on paid transition.

## Impact

- Backend trigger logic in `functions/src/on-item/order-status.ts`.
- Firestore write paths for `products` documents.
- Backend tests for paid-transition idempotency, stock decrement correctness, and failure handling.
