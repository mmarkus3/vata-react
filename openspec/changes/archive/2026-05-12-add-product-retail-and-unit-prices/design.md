## Context

The `Product` type already includes optional `retailPrice` and `unitPrice` fields, but current product create/edit user interfaces do not expose consistent inputs for these values, and persistence/display behavior is incomplete. Users need to maintain these prices as part of normal product lifecycle operations (create and update) without introducing separate workflows.

## Goals / Non-Goals

**Goals:**
- Allow entering `retailPrice` and `unitPrice` in new-product creation flow.
- Allow editing `retailPrice` and `unitPrice` in existing-product edit flow.
- Persist both fields and return them in product reads used by list/detail views.
- Keep UI style/accessibility consistency and localize all new texts via i18next.

**Non-Goals:**
- Reworking core product pricing model beyond these two fields.
- Introducing new reporting logic based on retail/unit prices.
- Backfilling historic product records with inferred pricing values.

## Decisions

1. Reuse existing create and edit surfaces.
- Decision: Extend `AddProductModal` and product detail edit form rather than creating separate pricing screens.
- Rationale: Lowest UX friction and minimal architecture changes.

2. Keep `retailPrice` and `unitPrice` optional numeric fields.
- Decision: Validate as non-negative numbers when provided, allow empty values.
- Rationale: Supports products where one or both values are not known.

3. Persist in same product write paths.
- Decision: Include fields directly in create/update payload mapping and rely on existing Firestore product document shape.
- Rationale: Avoids split data sources and keeps reads straightforward.

4. Show values consistently in product detail and storage list contexts where product data is consumed.
- Decision: Ensure downstream readers receive and can display these fields from refreshed product objects.
- Rationale: Prevents stale/missing pricing data after edits.

## Risks / Trade-offs

- [Risk] Numeric input parsing can produce invalid values with locale separators. -> Mitigation: normalize and validate input, with clear validation errors.
- [Risk] Optional fields may be saved inconsistently (`undefined`, empty string, `0`). -> Mitigation: map form state explicitly to `number | undefined` before writes.
- [Risk] Additional fields increase form complexity. -> Mitigation: keep labels clear and preserve current form grouping and style patterns.
