## Context

`app/product/[id].tsx` includes a large edit surface (identity, pricing, nutrition, amount, barcode, images) and currently couples field values and validation through many `useState` variables and imperative checks in `handleSave`. This increases maintenance cost and validation drift risk as product fields evolve. The app already uses React Native, TypeScript, i18next, and now has `react-hook-form` available from recent modal work.

## Goals / Non-Goals

**Goals:**
- Consolidate product detail text-field edit state under `react-hook-form`.
- Encode required and numeric/non-negative constraints as declarative form rules.
- Preserve existing save payload behavior, including optional pricing/nutrition parsing and trimming.
- Keep barcode/product image editing workflow behavior unchanged while integrating with form submit.

**Non-Goals:**
- Redesigning product detail layout or edit-mode UX structure.
- Changing backend product schema or update API contract.
- Reworking image upload implementation beyond submission integration.

## Decisions

1. Use `useForm` + `Controller` for product detail editable text inputs.
Rationale: central state/validation and consistent React Native input integration.
Alternative: keep current `useState` and extract validators. Rejected because state fan-out remains.

2. Keep barcode/product image collections and upload progress in local component state.
Rationale: media interactions are not plain scalar form fields and already have clear workflows.
Alternative: force all media into form state. Rejected due to added complexity without clear benefit.

3. Extract reusable parsing/validation helpers for optional decimals and non-negative checks.
Rationale: keep save transform deterministic and testable; avoid duplicated parsing logic.
Alternative: inline transformations per field. Rejected due to readability and drift risk.

4. Surface field validation errors via existing `productDetail.errors.*` translation keys.
Rationale: keeps localization consistent and avoids introducing hard-coded error strings.
Alternative: mixed hard-coded and translated messages. Rejected for consistency reasons.

## Risks / Trade-offs

- [Risk] Edit mode default values could desync from fetched product data. -> Mitigation: reset form values whenever fresh product data is loaded.
- [Risk] Validation timing changes may alter when users see errors. -> Mitigation: use submit-focused validation mode and preserve error placement.
- [Risk] Refactor could regress payload parity for optional numeric fields. -> Mitigation: keep a dedicated payload transform and test helper behavior.
