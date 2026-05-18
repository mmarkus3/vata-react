## Context

`placeOrder` in `functions/src/orders/orders.service.ts` currently validates only company ownership for the order but does not ensure ordered products still exist or that requested quantities are still available in stock. Stock can change between order creation and placement, so placement-time validation is needed to prevent invalid fulfillment commitments.

## Goals / Non-Goals

**Goals:**
- Validate at order placement that every referenced product exists.
- Validate at placement that each requested quantity is less than or equal to current product stock amount.
- Reject placement atomically with clear error when any line fails validation.

**Non-Goals:**
- Inventory decrement during `placeOrder` (if handled elsewhere).
- Pricing recalculation or order-line mutation logic.
- UI workflow changes.

## Decisions

- Validate all order lines against latest product documents before allowing placement.
Rationale: placement is the final commitment point and must use current data.
Alternative considered: validate only on order creation. Rejected due to stale data risk.

- Fail-fast with explicit backend errors for missing product IDs and insufficient stock.
Rationale: API clients can show accurate reason and avoid partial acceptance ambiguity.
Alternative considered: generic error only. Rejected due to poor debuggability.

- Keep validation read-only and side-effect free in this change.
Rationale: minimizes risk and keeps concern focused on precondition checks.
Alternative considered: combine with stock decrement. Rejected as separate concern.

## Risks / Trade-offs

- [Extra reads per placeOrder call] -> Mitigation: batch lookups where feasible and validate only selected product IDs.
- [Race conditions after validation but before downstream updates] -> Mitigation: document that atomic stock decrement must be handled in follow-up transactional step if required.
- [Inconsistent order line schema (missing ids/amounts)] -> Mitigation: add strict defensive checks and clear bad-request errors.
