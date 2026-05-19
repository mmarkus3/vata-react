## Context

Campaign create currently renders its own selected-products list UI directly in the campaign modal. The codebase already has a reusable `SelectProduct` component used in other flows, but it is tailored to current usage. Adapting it for campaigns enables shared selection patterns and less duplicated UI logic.

## Goals / Non-Goals

**Goals:**
- Integrate `SelectProduct` into campaign create flow for selected-products targeting mode.
- Extend `SelectProduct` APIs safely to support campaign-specific selection behavior.
- Preserve existing `SelectProduct` consumer behavior.

**Non-Goals:**
- Rebuilding `SelectProduct` from scratch.
- Changing campaign business rules unrelated to product picking.
- Refactoring unrelated client/fulfilment flows.

## Decisions

- Add optional props to `SelectProduct` rather than creating a separate campaign-only picker component.
- Keep backward compatibility defaults so existing screens remain unchanged.
- Move campaign product pick interaction to `SelectProduct` for source-of-truth selection UX.
- Add targeted tests for new props/branches to prevent regressions in existing consumers.

## Risks / Trade-offs

- [Regression risk in existing users] Shared component changes can break current flows -> keep new props optional and default-preserving.
- [Over-generalization] Component may become too broad -> keep campaign-specific logic minimal and callback-driven.
- [State sync complexity] Multi-select state coordination can drift -> use explicit controlled value/callback contract.
