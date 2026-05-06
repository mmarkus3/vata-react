## Context

Fullfilment creation was added to client detail, but created fullfilments do not yet deduct product amounts from storage. This creates inventory mismatch between recorded deliveries and available stock. The change crosses modal UI validation, fullfilment service logic, and product inventory persistence in Firestore.

## Goals / Non-Goals

**Goals:**
- Deduct storage amounts for each product when a fullfilment is created.
- Validate stock availability before commit and fail safely when stock is insufficient.
- Keep fullfilment creation and inventory deduction consistent (all succeed or none).
- Surface clear user feedback in Finnish for stock-related failures.

**Non-Goals:**
- Changing storage list UI structure or adding new inventory dashboards.
- Backfilling historical fullfilments to adjust old stock values.
- Supporting fractional amounts if current model uses integer units.

## Decisions

### Use Firestore transaction for atomic consistency
- **Decision:** Execute fullfilment creation and product amount decrements inside a single Firestore transaction.
- **Rationale:** Prevents partial writes where fullfilment is created but stock is not updated (or vice versa).
- **Alternative considered:** Sequential writes with rollback logic; rejected due to race conditions and rollback fragility.

### Validate availability per product before decrement
- **Decision:** In transaction, read each target product doc, confirm `amount >= requestedAmount`, then apply decrements.
- **Rationale:** Guarantees correctness under concurrent writes.
- **Alternative considered:** UI-only precheck from modal state; rejected because it can become stale before save.

### Keep modal UX mostly unchanged, add stock error mapping
- **Decision:** Reuse current modal flow and add explicit handling for stock insufficiency errors.
- **Rationale:** Minimal UX disruption while providing actionable feedback.
- **Alternative considered:** Prevent selection of low-stock products in UI; rejected for now because authoritative check must still happen server-side.

### Reuse existing product model and service boundaries
- **Decision:** Keep `Product.amount` as source of truth and extend service layer instead of direct page-level Firestore calls.
- **Rationale:** Maintains modularity and testability.
- **Alternative considered:** Inline transaction inside modal component; rejected as it couples UI and persistence logic.

## Risks / Trade-offs

- **Concurrent fullfilment creation on same products** -> Mitigated by transaction retries and server-side checks.
- **User confusion on failure reasons** -> Mitigated with explicit per-product insufficiency messages.
- **Increased write cost per fullfilment** -> Accepted trade-off for data correctness.
- **Legacy data with negative or missing amounts** -> Mitigated by defensive validation and failing closed.
