## Context

The backend now adjusts stock on paid order transitions with reusable logic, while fullfilment stock sync still originates from older client/service flows. This split creates duplicate responsibility and risk of divergence. A unified backend-trigger approach with shared stock utilities reduces inconsistency and centralizes inventory side effects.

## Goals / Non-Goals

**Goals:**
- Run fullfilment stock updates in backend `onDocumentWritten` trigger.
- Cover create, update, and delete fullfilment lifecycle with delta-based stock adjustments.
- Extract stock update helpers into shared common module used by both paid-order and fullfilment trigger flows.
- Preserve atomic transaction guarantees and stock validation.

**Non-Goals:**
- Reworking fullfilment UI behavior or form structure.
- Introducing warehouse-level partitioning logic.
- Changing paid-order decrement business rule timing.

## Decisions

- Use `onDocumentWritten('/fullfilments/{id}')` with before/after snapshots.
Rationale: one trigger handles create/update/delete uniformly.
Alternative considered: separate create/update/delete triggers; rejected for duplicated logic and harder consistency.

- Calculate fullfilment stock delta by comparing aggregated product amounts in `before` and `after` snapshots.
Rationale: supports all write types and line add/remove/edit with single algorithm.

- Extract common stock computation and validation helpers to shared backend utility module.
Rationale: avoid duplicated decrement/increment checks between paid-order and fullfilment pathways.

- Execute product stock writes in Firestore transaction.
Rationale: maintain all-or-nothing behavior for multi-line mutations.

## Risks / Trade-offs

- [Risk] Trigger recursion if fullfilment writes include fields updated by trigger logic.
  → Mitigation: trigger only writes product documents, never rewrites fullfilment document.

- [Risk] Legacy frontend stock updates may still run during migration and double-apply.
  → Mitigation: remove/disable client-side stock update logic in same change and test end-to-end behavior.

- [Risk] Increased trigger complexity due to shared utility abstractions.
  → Mitigation: keep helper interfaces small and add targeted tests for delta computation.

## Migration Plan

1. Extract stock utility functions from paid-order flow to shared backend module.
2. Introduce fullfilment `onDocumentWritten` trigger using shared helpers.
3. Remove/refactor client-side fullfilment stock adjustments.
4. Add tests for create/update/delete fullfilment stock deltas and rollback paths.
5. Run targeted test suites and deploy backend + client together.

Rollback strategy:
- Disable fullfilment write trigger and restore previous fullfilment stock adjustment path if needed.

## Open Questions

- Should fullfilment trigger ignore draft-like fullfilment statuses (if introduced later)?
- Do we need backfill tooling to reconcile historic fullfilment edits?
