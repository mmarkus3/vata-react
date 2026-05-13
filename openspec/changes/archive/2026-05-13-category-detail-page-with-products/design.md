## Context

The current categories home screen supports create, edit, and delete directly in a list. This makes the list dense and does not provide a place to inspect category context, especially which products are inside the category. Product-category assignment already exists in product create/edit, but there is no category-centric view for users to verify assignments.

## Goals / Non-Goals

**Goals:**
- Add a category detail page that displays category name, description, and products in that category.
- Move edit/delete category actions from list items into the category detail page.
- Keep category list focused on browsing and navigation.
- Preserve current create-category flow and existing product/category data model.

**Non-Goals:**
- No change to how product category values are stored.
- No bulk product reassignment workflow in this change.
- No redesign of add/edit category modal internals beyond relocation of trigger points.

## Decisions

1. Introduce dedicated route `app/category/[id].tsx` for category details.
Rationale: route-based detail is consistent with existing product detail patterns and supports deep links and clear action ownership.
Alternative considered: inline expandable cards in categories list. Rejected due to complexity and weaker navigation semantics.

2. Make category list items navigation-first and remove inline edit/delete controls.
Rationale: list should optimize scanability and reduce accidental destructive actions.
Alternative considered: keep small action icons in list and duplicate actions in detail. Rejected to avoid split ownership.

3. Reuse existing category edit/delete service logic from detail page.
Rationale: avoids duplicate mutation paths and preserves existing validations.
Alternative considered: replace modals with inline form immediately. Rejected for scope control.

4. Use existing products query by company and category to populate detail page product list.
Rationale: current services already provide a category filter query; reuse minimizes backend changes.
Alternative considered: join-like precomputed category-product map. Rejected as unnecessary complexity.

## Risks / Trade-offs

- [Risk] Navigating to a deleted or missing category ID may produce confusing state. → Mitigation: explicit not-found/error UI and safe back navigation.
- [Risk] Category delete from detail may leave products referencing stale category labels. → Mitigation: retain existing fallback handling behavior already defined in product category assignment capability.
- [Risk] Extra navigation step could slow quick edit workflows for power users. → Mitigation: keep detail page lightweight and include clear edit action near header.

## Migration Plan

1. Add category detail route and wire navigation from category list items.
2. Move edit/delete controls from list screen to detail screen.
3. Add category and product loading/error/empty states in detail page.
4. Validate category deletion and post-delete navigation behavior.
5. Add/update tests.

Rollback: revert route and list/detail wiring changes; restore list-level edit/delete actions.

## Open Questions

- Should category detail show product count in the list screen card to improve discoverability before navigation?
