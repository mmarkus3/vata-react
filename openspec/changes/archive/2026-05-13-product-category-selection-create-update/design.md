## Context

The product model already supports an optional `category` field, and category CRUD exists in the app, but product create and edit forms do not provide a consistent category selection control. This leads to incomplete product metadata and forces users to work around category assignment after product operations.

## Goals / Non-Goals

**Goals:**
- Add category selection to both product create and product update form workflows.
- Ensure selected category values are included in create/update payloads.
- Keep form behavior aligned with existing react-hook-form patterns used in product create/edit.
- Handle stale category values gracefully when a product references a category not currently available in category list.

**Non-Goals:**
- Building new category management screens.
- Changing category schema or introducing category hierarchy.
- Redesigning existing product forms beyond category field integration.

## Decisions

1. Use a shared category selector field model in create and update forms.
Rationale: keeps behavior consistent and reduces drift between flows.
Alternative: separate ad-hoc controls per screen. Rejected due to duplicated logic.

2. Treat category as optional but explicit form state.
Rationale: preserves backward compatibility while enabling assignment at creation/update time.
Alternative: make category required. Rejected because existing products and workflows allow uncategorized items.

3. Persist selected category as product `category` value in create/update payloads.
Rationale: aligns with current `Product` type and downstream reads without backend contract changes.
Alternative: defer category persistence to separate endpoint. Rejected because it adds user friction and race risk.

4. Surface stale category references as selectable fallback values when editing existing products.
Rationale: users must be able to preserve or replace existing saved values even if category list changed.
Alternative: silently clear unknown category. Rejected because it can cause accidental data loss.

## Risks / Trade-offs

- [Risk] Category list load timing can cause empty selector at form start. -> Mitigation: show loading/disabled selector state until categories are available.
- [Risk] Deleted/renamed categories may not match product-stored value. -> Mitigation: include fallback display option for current saved value and require explicit user change.
- [Risk] Divergent behavior between create and edit selectors. -> Mitigation: define shared requirements and test create/edit payload mapping parity.
