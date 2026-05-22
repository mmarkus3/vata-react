## Context

The system already reacts to order status transitions in backend update triggers (e.g., notification creation for `paid` and `sent`). Inventory should now be synchronized in the same order-update lifecycle so paid orders consistently reduce stock without relying on client-only behavior.

## Goals / Non-Goals

**Goals:**
- Decrement product stock when order status transitions from non-`paid` to `paid`.
- Apply decrements for all order lines in the paid order.
- Keep operations atomic to avoid partial stock writes.
- Avoid repeated decrements when an already-paid order is updated.

**Non-Goals:**
- Reworking order placement validation logic.
- New UI for manual stock corrections.
- Multi-warehouse stock distribution logic.

## Decisions

- Implement stock decrement in existing `onDocumentUpdated('/orders/{orderId}')` trigger.
Rationale: status transition context (`before`/`after`) already exists there and keeps order side effects centralized.
Alternative considered: separate dedicated trigger; rejected to avoid duplicate order-update subscriptions.

- Trigger decrement only on strict transition `before.status !== 'paid' && after.status === 'paid'`.
Rationale: prevents duplicate stock reduction on later edits.

- Use Firestore transaction/batched atomic flow for product decrements.
Rationale: all-or-nothing updates are required when multiple product lines exist.

- Validate referenced products still exist and have sufficient amount during decrement.
Rationale: protects against stale order/product states and avoids negative stock.

## Risks / Trade-offs

- [Risk] Concurrent paid transitions across orders may contend on same products.
  → Mitigation: use transaction with current stock reads and retry semantics.

- [Risk] Legacy orders already marked paid before deploy won’t be decremented retroactively.
  → Mitigation: treat this as forward-only behavior; run a separate reconciliation if needed.

- [Risk] Failure in one line could block notification side effects in shared trigger flow.
  → Mitigation: keep side effects ordered and fail fast with clear logs; test combined trigger behavior.

## Migration Plan

1. Extend existing order update trigger with paid-transition stock decrement logic.
2. Add helper(s) for decrement calculation and guard checks.
3. Add/update tests for successful decrement, insufficient stock, missing product, and idempotent re-update.
4. Deploy functions.

Rollback strategy:
- Remove paid-stock-decrement section from trigger; existing notification behavior remains.

## Open Questions

- Should paid transition fail entirely (with retry) when decrement fails, or should failure be logged and skipped?
- Do we need reconciliation tooling for historical paid orders?
