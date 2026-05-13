## Context

Product create and edit flows currently emphasize price and nutrition fields but do not consistently expose multilingual product metadata fields that are already present in the `Product` type (`countryOfOrigin`, `ingredients_fi/sv/en`, `description_fi/sv/en`). The change touches both modal creation (`components/home/AddProductModal.tsx`) and product detail editing (`app/product/[id].tsx`) with shared constraints:
- Form state is managed with react-hook-form helper modules.
- Firestore rejects `undefined`, so optional field persistence must use null-safe payload normalization.
- UI text must be localized with i18next and remain consistent with existing accordion-based UX.

## Goals / Non-Goals

**Goals:**
- Add country of origin, multilingual ingredients, and multilingual descriptions to create and edit forms.
- Keep field handling consistent with the current react-hook-form architecture by extending form value types, defaults, and payload mappers.
- Preserve Firestore-safe writes by ensuring empty optional text values are normalized before save.
- Keep accordion grouping understandable by placing new fields in the basic section and ensuring validation/error discoverability remains intact.

**Non-Goals:**
- No schema migration of existing product documents beyond normal update behavior.
- No automatic language translation between Finnish, Swedish, and English.
- No redesign of category, pricing, nutrition, or image workflows.

## Decisions

1. Extend existing form helper modules instead of introducing a separate localized-content form model.
Rationale: both create and edit screens already depend on `addProductForm.ts` and `productDetailForm.ts` as mapping boundaries. Adding new string fields there keeps conversion logic centralized and testable.
Alternative considered: direct inline state mapping in screen components. Rejected because it duplicates parsing/normalization logic and increases regressions between create and edit flows.

2. Represent optional multilingual text and origin fields as trimmed strings in forms, and normalize empty values to `null` at persistence boundaries.
Rationale: users should freely leave fields empty, while Firestore write paths must avoid `undefined`. Keeping raw form fields as strings improves input ergonomics and reuse of existing controllers.
Alternative considered: storing `undefined` for empty fields. Rejected because Firestore write operations can fail and current backend conventions already favor null-safe payloads.

3. Add i18next keys for labels/placeholders/errors for each localized field rather than hard-coded text.
Rationale: this project already localizes UI messaging; new multilingual content fields must be translatable and consistent across create/edit pages.
Alternative considered: temporarily hard-code Finnish labels. Rejected due to inconsistent UX and reduced maintainability.

4. Reuse existing accordion information architecture by placing the new text fields into the `basic` section.
Rationale: origin, ingredients, and descriptions are product identity metadata, not pricing or nutrition metrics. This minimizes cognitive load and avoids introducing a fourth accordion section.
Alternative considered: add a dedicated “content” section. Rejected for now to avoid extra UX complexity during this incremental enhancement.

## Risks / Trade-offs

- [Risk] Added fields increase form length and could reduce completion speed on mobile. → Mitigation: keep grouping under the already-open basic accordion and preserve concise labels/placeholders.
- [Risk] Inconsistent normalization between create and update payloads could produce divergent stored values (`''` vs `null`). → Mitigation: update both create and update mapping paths together and cover with Jest tests.
- [Risk] Missing translation keys can ship as raw key strings. → Mitigation: add translation entries for both add-product and product-detail namespaces and validate screens manually.
- [Risk] Existing products may lack new keys, causing uncontrolled form defaults if not mapped safely. → Mitigation: initialize all new form fields with empty-string defaults in both helper modules.
