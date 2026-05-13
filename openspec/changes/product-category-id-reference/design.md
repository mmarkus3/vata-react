## Context

Current product-category relation stores category display name in `Product.category`. This makes references unstable under category rename and can fail when names collide. Category detail and assignment features recently expanded, increasing the cost of unstable references. The system already has stable category ids and route-based category pages, so relational consistency should use ids while keeping name labels for presentation.

## Goals / Non-Goals

**Goals:**
- Persist and query product category using category id.
- Keep product/category UI readable by displaying category name labels derived from category id.
- Ensure category detail and assignment flows use id-based matching.
- Provide migration/compatibility handling for legacy name-based products.

**Non-Goals:**
- No change to category entity primary key strategy.
- No redesign of category/product screens beyond relation semantics.
- No backend service rewrite outside category-relation concerns.

## Decisions

1. Keep `Product.category` field name for now but redefine its semantic value as category id.
Rationale: minimizes broad refactor while changing semantics where needed.
Alternative considered: introduce `categoryId` new field and deprecate `category`. Rejected for immediate scope but remains a potential follow-up.

2. Update category selectors/options to use category id as value and name as label.
Rationale: preserves user-visible naming while persisting stable ids.

3. Update category detail product retrieval from name-based filter to id-based filter.
Rationale: direct relational consistency and rename safety.

4. Add migration-safe behavior for legacy name values.
Rationale: existing data likely contains names; immediate hard cutover could hide products. During migration window, system should either migrate records or include fallback resolution.

## Risks / Trade-offs

- [Risk] Mixed legacy/new data can produce inconsistent listing if fallback is incomplete. → Mitigation: explicit migration task plus compatibility checks in query/mapping.
- [Risk] Reusing `category` field name for id may confuse future developers. → Mitigation: document semantics and consider later rename to `categoryId`.
- [Risk] Category options fallback logic may mismatch stale ids. → Mitigation: preserve unknown-value handling and label fallback in selectors.

## Migration Plan

1. Update client persistence to write category id for create/edit/assignment flows.
2. Add read compatibility for legacy name values where needed.
3. Implement one-time migration script/process to rewrite legacy product `category` from name to id where resolvable.
4. Validate category detail listings and assignment after migration.
5. Remove/limit compatibility fallback once migration coverage is complete.

Rollback: revert write-path to names and keep compatibility mapping; no schema lock-in required.

## Open Questions

- Should we perform migration client-side lazily (on product touch) or via dedicated admin/batch script?
