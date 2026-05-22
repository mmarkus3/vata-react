## Context

Backend fullfilment stock sync already applies before/after deltas, which should restore stock when lines are removed. This change formalizes that behavior with explicit requirement and verification to avoid regressions.

## Goals / Non-Goals

**Goals:**
- Guarantee stock restoration when a product line is removed from fullfilment update.
- Keep behavior inside existing backend fullfilment write trigger.
- Add focused tests that prove removal restoration path.

**Non-Goals:**
- Reworking fullfilment UI.
- Changing stock behavior for paid orders.
- Introducing new trigger types.

## Decisions

- Reuse existing fullfilment delta algorithm and enforce explicit scenario for removed lines.
Rationale: current architecture already supports this through before/after diff; we strengthen contract and tests.

- Add dedicated test cases for removal-only and mixed update (remove + modify).
Rationale: this is the highest-risk regression surface for delta-based logic.

## Risks / Trade-offs

- [Risk] False confidence if tests only cover helper-level behavior.
  → Mitigation: include trigger-level or integration-style unit coverage where possible.

- [Risk] Concurrent edits may still create contention on shared products.
  → Mitigation: rely on existing transaction semantics; no architectural change here.

## Migration Plan

1. Verify/adjust delta logic if needed for removed lines.
2. Add/update tests specifically for removed-product restoration behavior.
3. Run targeted backend tests.

Rollback strategy:
- Revert test/logic adjustments; previous generalized delta behavior remains.

## Open Questions

- Should we also emit operational logs/metrics for restored quantities on removals?
