## Context

The current bottom-tab layout exposes six destinations at once, which makes primary workflows less focused and increases navigation noise. The desired redesign keeps `Varasto`, `Tilaukset`, and `Raportti` as primary tabs while moving `Asiakkaat`, `Kategoriat`, and `Profiili` under a menu icon interaction.

## Goals / Non-Goals

**Goals:**
- Keep three primary tabs visible: `Varasto`, `Tilaukset`, `Raportti`.
- Add a menu icon entry that reveals secondary destinations.
- Keep existing routes/screens for `Asiakkaat`, `Kategoriat`, `Profiili` reachable through the menu.
- Maintain accessibility-friendly navigation and clear labeling.

**Non-Goals:**
- Reworking content within client/category/profile screens.
- Redesigning all app navigation beyond home-tab scope.
- Introducing role-based navigation differences.

## Decisions

- Use an overflow menu trigger (menu icon tab action) instead of showing all secondary sections as tabs.
Rationale: preserves quick access to primary flows and reduces tab bar clutter.
Alternative considered: horizontal tab scrolling. Rejected due to discoverability/accessibility concerns.

- Keep routes stable for `clients`, `categories`, and `settings` and only change entry point.
Rationale: reduces migration risk and avoids deep-link breakage.
Alternative considered: move routes into a new stack group. Rejected for unnecessary churn.

- Define explicit menu open/close behavior and item navigation expectations in specs.
Rationale: ensures consistent UX and testability.
Alternative considered: leave interaction unspecified. Rejected due to ambiguity.

## Risks / Trade-offs

- [Menu discoverability for secondary items] -> Mitigation: use clear icon + label/accessibility hint and prominent menu item text.
- [Potential regression in existing tab tests] -> Mitigation: update nav config tests to assert visible primary tabs and overflow routing.
- [Mobile/web interaction differences for menu overlays] -> Mitigation: use cross-platform React Native primitives and test both platforms manually.
