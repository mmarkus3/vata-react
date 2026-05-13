## Context

Category detail currently displays category metadata and already-assigned products, but it lacks an action to add products into that category. Users must navigate to each product detail or creation flow to assign category values one-by-one. We already have service primitives needed for category-page assignment: real-time product queries and product update mutation.

## Goals / Non-Goals

**Goals:**
- Add a category-detail initiated assignment flow to attach products to the current category.
- Support selecting one or more products that are not currently in the category.
- Persist assignment through existing product update service path.
- Keep category product list updated after successful assignment.

**Non-Goals:**
- No bulk removal of products from category in this change.
- No new backend collections or schema changes.
- No changes to product create/edit category selector behavior.

## Decisions

1. Add an assignment CTA in category detail (e.g. "Lisää tuotteita kategoriaan") that opens a lightweight product selector.
Rationale: keeps assignment close to where users inspect category contents.
Alternative considered: navigate to separate assignment screen. Rejected to reduce navigation overhead.

2. Populate selectable products using `getProductsByCompany` filtered client-side to exclude products already in the category.
Rationale: leverages existing real-time query and avoids introducing extra query permutations.
Alternative considered: new dedicated service query for uncategorized/other-category products. Rejected for now to keep service surface minimal.

3. Persist assignment via `updateProduct(productId, { category: category.name })` for each selected product.
Rationale: reuses existing update logic and normalization behavior.
Alternative considered: custom batch endpoint. Rejected due to complexity and lack of immediate need.

4. Keep UX resilient with explicit states (loading candidates, saving assignments, per-flow errors) and refresh visible category products after save.
Rationale: assignment is mutation-heavy and needs clear feedback to avoid duplicate taps/confusion.

## Risks / Trade-offs

- [Risk] Sequential updates for many products may be slow. → Mitigation: show saving indicator and disable submit while updates run.
- [Risk] Category name edits can race with assignment flow. → Mitigation: resolve current category name from latest loaded category before applying updates.
- [Risk] Product list size could make selector dense. → Mitigation: start with simple searchable/selectable list and pagination optimization later if needed.

## Migration Plan

1. Add assignment UI/action to category detail page.
2. Load candidate products and exclude currently assigned ones.
3. Implement assignment submit using existing `updateProduct` calls.
4. Refresh category products and close selector on success.
5. Add tests for candidate filtering and assignment success/error behavior.

Rollback: remove assignment UI and mutation hook-up; existing category detail view remains functional.

## Open Questions

- Should assignment flow allow filtering candidates by product name search from the first release?
