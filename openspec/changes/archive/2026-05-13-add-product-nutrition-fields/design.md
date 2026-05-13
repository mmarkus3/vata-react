## Context

The product type includes nutrition fields (`energyJoule`, `energyCalory`, `fat`, `saturatedFat`, `carbohydrate`, `saturatedCarbohydrate`, `protein`, `salt`, `fiber`) but current create/edit user interfaces do not provide complete structured inputs and validation for maintaining them. Users need these values managed as part of normal product lifecycle, both for new products and existing products.

## Goals / Non-Goals

**Goals:**
- Add nutrition field inputs to new product creation and existing product edit flows.
- Persist nutrition field values as optional non-negative numeric values.
- Ensure product reads return the saved nutrition values for downstream consumers.
- Keep styling/accessibility consistency and localize all new labels/errors through i18next.

**Non-Goals:**
- Building nutrition-based analytics or calculations.
- Enforcing mandatory nutrition completeness for all products.
- Redesigning storage architecture or product data source boundaries.

## Decisions

1. Reuse current product forms.
- Decision: Extend existing create modal and product detail edit form with additional nutrition inputs.
- Rationale: Minimal UX disruption and no new navigation complexity.

2. Treat nutrition values as optional normalized numbers.
- Decision: Accept blank values, parse user input as numbers, validate non-negative when provided.
- Rationale: Supports partially known nutrition data while maintaining data quality.

3. Persist through existing product service paths.
- Decision: Include nutrition fields directly in create/update payloads and ensure read normalization in product converter.
- Rationale: Single source of truth and straightforward compatibility for existing consumers.

4. Keep localization-first field presentation.
- Decision: Add i18next keys for all new field labels/placeholders/error states in fi/en bundles.
- Rationale: Consistent multilingual UX and avoids hard-coded strings.

## Risks / Trade-offs

- [Risk] Many additional inputs can increase form fatigue. -> Mitigation: keep grouped order and concise labels mirroring nutrition label terminology.
- [Risk] Numeric parsing differences (comma vs dot) can produce invalid values. -> Mitigation: normalize separators before validation and show explicit errors.
- [Risk] Optional fields can be inconsistently saved as empty/undefined/zero. -> Mitigation: map form state explicitly to `number | undefined` before writes.
