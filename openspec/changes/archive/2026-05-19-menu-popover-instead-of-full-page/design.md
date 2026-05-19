## Context

The current overflow navigation uses a dedicated full-page `Menu` screen, which introduces an extra route transition for simple secondary navigation choices. A popover anchored to the menu icon would preserve context in the current screen and reduce interaction cost.

## Goals / Non-Goals

**Goals:**
- Replace full-page menu navigation with a popover interaction.
- Keep menu options `Asiakkaat`, `Kategoriat`, and `Profiili` unchanged.
- Preserve existing destination routes for those options.

**Non-Goals:**
- Changing content inside target destination screens.
- Reworking primary tab ordering (`Varasto`, `Tilaukset`, `Raportti`).
- Introducing advanced nested menu structures.

## Decisions

- Use an in-place overlay/popover component controlled by menu-icon press state.
Rationale: keeps users on current context and supports quick secondary navigation.
Alternative considered: keep dedicated menu route. Rejected due to extra navigation step.

- Close popover on outside press, destination press, and tab change.
Rationale: predictable interaction and avoids stale overlay state.
Alternative considered: persist until explicit close. Rejected for UX friction.

- Keep route mapping logic centralized (existing overflow config) and reuse it in popover rendering.
Rationale: avoids duplication and preserves testability.
Alternative considered: hardcode options in tab layout. Rejected due to maintainability.

## Risks / Trade-offs

- [Popover positioning differences across web/mobile] -> Mitigation: use simple anchored layout with safe defaults and responsive bounds.
- [Overlay may block interactions if not dismissed] -> Mitigation: add backdrop press and navigation-triggered close behavior.
- [Regression in existing menu tests] -> Mitigation: update tests for popover visibility toggling and route mapping invariants.
