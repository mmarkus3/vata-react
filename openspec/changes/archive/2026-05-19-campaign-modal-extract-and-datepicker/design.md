## Context

The campaign creation flow was recently added directly inside `app/(home)/campaigns.tsx` and now contains a large modal tree with multiple controls. This makes the parent screen harder to read and increases coupling between list behavior and create-form UI. Date fields are currently plain text and require manual ISO-style input.

## Goals / Non-Goals

**Goals:**
- Move campaign create modal markup and UI state props to a dedicated file/component.
- Use datepicker controls for selecting campaign start and end dates.
- Preserve current creation logic and validation contracts.

**Non-Goals:**
- Redesigning campaign creation fields beyond the date input control change.
- Changing campaign business rules (mode, targeting, discount behavior).
- Introducing backend/API changes.

## Decisions

- Create a dedicated `CampaignCreateModal` component with explicit props for visibility, values, callbacks, loading, and errors.
- Keep parent screen ownership of business data/hook orchestration to avoid hidden side effects in modal component.
- Represent selected dates in form state as serializable strings (or Date objects consistently) while using datepicker UI for user interaction.
- Use platform-compatible datepicker strategy already used in project dependencies (or add minimal dependency if required).

## Risks / Trade-offs

- [Date serialization mismatch] Picker returns Date while existing validators may expect strings -> normalize at component boundary.
- [Component prop sprawl] Extracted modal can gain many props -> group related props into small typed objects where useful.
- [Regression risk] Refactor can break save wiring/events -> add focused tests for modal callbacks and date updates.
