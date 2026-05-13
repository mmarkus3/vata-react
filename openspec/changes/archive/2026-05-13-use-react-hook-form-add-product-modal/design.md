## Context

`AddProductModal` currently uses a large set of local `useState` values and imperative validation inside `handleCreate`. This makes changes risky because field state, validation logic, parsing rules, and submit behavior are spread across multiple branches. The project uses TypeScript, React Native, Expo, and i18next, and modal UX consistency is important for storage workflows.

## Goals / Non-Goals

**Goals:**
- Consolidate form state management in `AddProductModal` using `react-hook-form`.
- Encode required-field and numeric/non-negative constraints declaratively.
- Preserve current create-product payload behavior, including optional pricing and nutrition parsing.
- Keep existing image picking and URL list interactions working with form submit.

**Non-Goals:**
- Redesigning modal layout or visual style.
- Changing backend product schema or create API contract.
- Reworking image upload services beyond minimal integration with new submit flow.

## Decisions

1. Adopt `react-hook-form` `useForm` + `Controller` for all text inputs.
Rationale: Centralized state and validation reduce repetitive hooks and manual checks while fitting React Native `TextInput` integration.
Alternative considered: Keep `useState` and extract validators. Rejected because state sprawl remains and validation still fragments across handlers.

2. Keep parsing and payload shaping in a small submit transformer function.
Rationale: Existing behavior (comma decimal support, optional numeric fields, nutrition map conversion) must remain stable and testable.
Alternative considered: Parse directly in each field `onChange`. Rejected because it complicates typing and can degrade input UX.

3. Maintain image-link and selected-image collections as component state outside form fields.
Rationale: These values are list-like/media interactions, not plain text form controls, and already have clear handlers.
Alternative considered: Include image arrays inside form state. Rejected to avoid unnecessary controller complexity and because current behavior is adequate.

4. Normalize validation messages through i18next keys where errors are user-facing.
Rationale: Supports localization consistency and avoids hard-coded strings in validation paths.
Alternative considered: Keep mixed hard-coded and translated errors. Rejected due to inconsistency and translation debt.

## Risks / Trade-offs

- [Risk] Validation timing changes could alter when users see errors. -> Mitigation: Configure form mode intentionally and keep submit-time guardrails equivalent to current checks.
- [Risk] Migration may miss one of the optional nutrition fields during mapping. -> Mitigation: Retain a single source array for nutrition key mapping and cover with unit tests.
- [Risk] React Native input integration with `Controller` can cause extra re-renders. -> Mitigation: Keep field components simple and avoid unnecessary derived state in render.
