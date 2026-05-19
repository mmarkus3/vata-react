## Context

The app recently introduced campaigns as a navigable destination, but the current campaigns screen is only a placeholder header. Users need a real list of campaigns with predictable states, matching patterns already used in orders/clients screens.

## Goals / Non-Goals

**Goals:**
- Show campaigns in a list view on the campaigns screen.
- Handle loading, empty, and error states explicitly.
- Keep UI/architecture aligned with existing home-tab screens.

**Non-Goals:**
- Campaign create/edit/delete workflows.
- Deep campaign detail page behavior.
- Changes to navigation structure itself.

## Decisions

- Implement a campaigns screen data-loading flow similar to other list screens in `app/(home)`.
- Use a small UI-state helper (if needed) for testable list-state decisions.
- Keep labels localized via i18next keys under a campaigns namespace.
- Keep row data minimal for first version (e.g., name/status/date range if available), with graceful fallbacks.

## Risks / Trade-offs

- [Data model uncertainty] Campaign schema may vary -> Start with tolerant rendering and optional-field fallbacks.
- [Service gap] Campaign fetch function may not exist yet -> Introduce a focused service function with clear typing.
- [State regressions] Async state handling can break UX -> Add targeted unit tests for loading/empty/error flows.
