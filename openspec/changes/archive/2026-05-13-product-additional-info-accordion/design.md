## Context

Product create and product detail forms use shared accordion structure (`basic`, `price`, `nutritions`) to reduce visual density. After adding multilingual `ingredients_*` and `description_*` fields, the `basic` section now contains both identity fields and long-form textual metadata, increasing scan time and making edits harder on mobile. The requested change introduces a dedicated `additionalInfo` section for these metadata fields while keeping existing data model and payload behavior unchanged.

## Goals / Non-Goals

**Goals:**
- Move multilingual ingredients and descriptions from `basic` into a dedicated `additionalInfo` accordion section in create and edit screens.
- Keep `countryOfOrigin` in `basic`.
- Preserve react-hook-form validation and error expansion behavior, including automatic opening of the owning section.
- Keep localization complete by introducing section title keys for both add-product and product-detail contexts.

**Non-Goals:**
- No changes to stored product field names, payload normalization, or Firestore persistence behavior.
- No new validations for ingredients/description fields.
- No redesign of price/nutrition sections or image workflows.

## Decisions

1. Extend section key unions from three sections to four (`additionalInfo`) in both accordion mapping modules.
Rationale: field-to-section mapping is the single source used by error-driven auto-expansion. Updating these mappings guarantees behavior parity without duplicating logic in screen components.
Alternative considered: conditional expansion logic directly in screen components. Rejected due to duplicated and brittle field checks.

2. Place `ingredients_*` and `description_*` only in `additionalInfo`, while `countryOfOrigin` remains in `basic`.
Rationale: origin is a compact identity field, while ingredients/descriptions are optional long-form content. This split preserves quick access to key basics and groups verbose text together.
Alternative considered: moving all three concerns together. Rejected to avoid burying a frequently read single-value field.

3. Keep existing form model and service payload mapping untouched.
Rationale: this is a presentation/grouping change; data capture and persistence already work and are covered by recent specs/tests.
Alternative considered: refactor form helpers during this change. Rejected to keep scope focused and reduce regression risk.

## Risks / Trade-offs

- [Risk] Users may not discover moved fields immediately. → Mitigation: clear section label (`Lisätiedot` / `Additional info`) and keep section near `basic`.
- [Risk] Missing field mapping updates can break auto-expansion for validation errors. → Mitigation: update both accordion mapping modules and add tests for section-field mapping.
- [Risk] Translation drift between add-product and product-detail sections. → Mitigation: add keys in both FI/EN dictionaries in the same change.

## Migration Plan

1. Add `additionalInfo` section key and field mapping changes for create and edit accordion helpers.
2. Update create and edit screen JSX to render the new accordion section and move the six multilingual text inputs there.
3. Add i18n section labels for add-product and product-detail.
4. Update/extend tests that verify section mapping and run targeted suites.
5. Deploy normally; no backend/data migration required.

Rollback: revert UI/mapping/i18n commits to restore previous 3-section layout.

## Open Questions

- Should `countryOfOrigin` eventually move to `additionalInfo` as well for stricter semantic grouping, or remain in `basic` long-term?
