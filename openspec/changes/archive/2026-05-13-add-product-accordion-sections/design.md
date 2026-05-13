## Context

`AddProductModal` currently renders a long sequence of inputs in a single continuous block. As fields have grown (category, pricing variants, nutrition values, media), users must scroll heavily and mentally group related fields themselves.

## Goals / Non-Goals

**Goals:**
- Organize add-product fields into clearly labeled accordion groups: `basic`, `price`, and `nutritions`.
- Keep existing validation, payload mapping, and submit lifecycle unchanged.
- Define predictable default expansion behavior and interaction expectations for grouped form completion.

**Non-Goals:**
- Changing backend product schema or create API contract.
- Redesigning image and barcode blocks beyond placement relative to accordion groups.
- Rewriting form validation strategy.

## Decisions

1. Use accordion grouping only for field presentation, not for data model changes.
Rationale: preserve stable create behavior while improving scanability.
Alternative: split modal into multi-step wizard. Rejected due to extra state complexity and navigation friction.

2. Keep `basic` section expanded by default, with `price` and `nutritions` collapsible.
Rationale: users should immediately see minimum required inputs while optional groups remain discoverable.
Alternative: all sections collapsed by default. Rejected because it hides required-field path.

3. Preserve existing field names and react-hook-form bindings inside accordion content.
Rationale: avoids regressions in validation and submit payload mapping.
Alternative: remap fields into nested objects per section. Rejected because no contract benefit.

4. Localize all section labels and helper cues via i18next keys.
Rationale: maintain multilingual UX consistency.
Alternative: hard-coded section titles. Rejected due to localization standards.

## Risks / Trade-offs

- [Risk] Collapsed sections may hide validation errors. -> Mitigation: expand section with first validation error on submit failure or show top-level error summary pointing to section.
- [Risk] Added UI state for accordion open/close may create edge-case resets. -> Mitigation: keep section open-state independent from form values and reset predictably on modal close.
- [Risk] Extra interaction taps for optional fields. -> Mitigation: default-open required section and keep optional sections easy to expand with clear labels.
