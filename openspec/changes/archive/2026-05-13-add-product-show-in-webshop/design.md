## Context

Product visibility in the webshop is currently implicit and not controlled by an explicit product-level flag. The platform already uses React Hook Form for product editing and Firestore for persistence, with a strict rule to avoid writing `undefined` values. This change introduces `showInWebshop` as a first-class boolean in product create/edit and data storage flows so webshop publishing behavior is deterministic and user-controlled.

## Goals / Non-Goals

**Goals:**
- Add a canonical `showInWebshop` boolean field to product data.
- Enable users to set and update this field in product create/edit UI.
- Persist and read the field safely across Firestore adapters without sending `undefined`.
- Keep behavior backward-compatible for existing documents that do not yet contain the field.

**Non-Goals:**
- Redesign webshop merchandising or search ranking logic.
- Add bulk visibility editing across multiple products.
- Change unrelated product detail form section architecture.

## Decisions

1. Data model uses non-optional boolean semantics at runtime
- Decision: Treat `showInWebshop` as a boolean in UI/domain logic with an explicit fallback for legacy documents.
- Rationale: Prevent tri-state ambiguity (`true`/`false`/missing) and keep filtering behavior deterministic.
- Alternative considered: Keep field optional and infer default in each consumer. Rejected because it spreads fallback logic and increases regression risk.

2. Default visibility value on create and legacy reads
- Decision: Default to `true` when creating new products and when reading documents missing `showInWebshop`.
- Rationale: Preserves historical behavior where products were generally visible unless otherwise restricted.
- Alternative considered: Default missing values to `false`. Rejected because it could silently hide existing catalog items.

3. Form integration via existing React Hook Form product detail capability
- Decision: Add the field as a controlled boolean input within existing form state/submit mapping.
- Rationale: Keeps field validation, dirty tracking, and submit lifecycle consistent with current product edit architecture.
- Alternative considered: Handle field outside the form with ad hoc state. Rejected due to inconsistent UX and duplicated save logic.

4. Firestore write sanitization compatibility
- Decision: Ensure create/update payload builders always emit a concrete boolean and never `undefined` for `showInWebshop`.
- Rationale: Aligns with established Firestore constraints and avoids write-time validation errors.
- Alternative considered: Omit the field when unchanged. Rejected because it complicates sync semantics and partial update expectations.

## Risks / Trade-offs

- Legacy data defaulting may not match every merchant intent -> Mitigation: Choose default `false` to prevent accidental webshop exposure and allow explicit user opt-in per product.
- UI placement could be missed by users if not discoverable -> Mitigation: Place the control in a prominent product section with clear localized labeling.
- Multiple read/write paths may drift on fallback behavior -> Mitigation: Centralize mapping/default logic in shared product adapters and cover with tests.
- Introducing a new field increases payload surface -> Mitigation: Keep field boolean-only and reuse existing form/update infrastructure.

## Migration Plan

1. Ship read-path fallback so missing `showInWebshop` is treated as `false`.
2. Ship UI + write-path support for setting explicit values on create/edit.
3. As products are edited, persisted documents gain explicit `showInWebshop` values.
4. Optional follow-up backfill can be run later if full explicitness is required for analytics.
5. Rollback strategy: revert UI field and adapter writes while retaining read fallback to avoid runtime breakage from existing mixed documents.

## Open Questions

- Should the field be surfaced in list/table quick actions (toggle without opening detail)?
- Is a one-time Firestore backfill desired now, or can explicit values accrue organically via edits?
