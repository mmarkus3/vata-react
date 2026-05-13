## Context

`app/category/[id].tsx` currently contains category loading, products listing, edit/delete actions, and full assignment modal state/mutations. This creates a high-complexity screen component and slows maintenance. The assignment flow already has helper logic in `categoryAssignment.ts`, but UI behavior remains tightly coupled to page internals. Users also need faster selection in large product lists, which requires filtering.

## Goals / Non-Goals

**Goals:**
- Extract category assignment UI/logic into dedicated files with clear interfaces.
- Add product filtering (e.g., by product name text) in assignment picker.
- Preserve existing assignment outcomes and category page navigation/actions.
- Improve testability by isolating assignment state transitions and filtering logic.

**Non-Goals:**
- No backend API or Firestore schema changes.
- No change to category edit/delete behavior.
- No redesign of assigned-products list layout in category detail.

## Decisions

1. Introduce dedicated assignment component (e.g. `CategoryProductAssignmentModal`) and keep page-level orchestration minimal.
Rationale: clear boundaries reduce file size and cognitive load.
Alternative considered: keep everything in page and only add helper functions. Rejected due to persistent complexity.

2. Keep mutation path via existing `updateProduct` per selected product.
Rationale: stable, already-tested service behavior.
Alternative considered: batch mutation service. Rejected as out-of-scope.

3. Implement client-side filtering over already-loaded candidate products.
Rationale: no extra network query complexity and immediate responsive UX.
Alternative considered: server-side search query. Rejected due to current Firestore query limitations and scope.

4. Add explicit filtering helper(s) with tests to guarantee deterministic matching behavior.
Rationale: filtering behavior should be independently testable and reusable.

## Risks / Trade-offs

- [Risk] Extraction may temporarily break prop wiring and assignment refresh behavior. → Mitigation: keep integration tests and focused helper tests.
- [Risk] Client-side filtering on very large lists may be slower. → Mitigation: lightweight string matching and deferred optimization.
- [Risk] UI split across files can duplicate types if not centralized. → Mitigation: colocate shared assignment types/helpers in a single module.

## Migration Plan

1. Create assignment component/module with existing modal UI and logic.
2. Replace inline assignment block in category detail page with component usage.
3. Add filtering input and filtered candidate rendering.
4. Validate assignment success/error/loading behavior parity.
5. Update tests for filtering and componentized state handling.

Rollback: re-inline assignment component into category detail page and remove new component files.

## Open Questions

- Should filtering match category, EAN, and barcode in addition to product name for better discoverability?
