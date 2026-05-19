## Context

The app currently uses a compact primary tab bar and a popover overflow menu for secondary sections. At the moment `Asiakkaat` is in overflow, which adds extra taps for a high-frequency workflow. The requested change is to promote `Asiakkaat` into the always-visible tab bar while preserving overflow behavior for less frequent sections.

## Goals / Non-Goals

**Goals:**
- Render `Asiakkaat` as a visible primary tab.
- Remove `Asiakkaat` from overflow menu options.
- Preserve existing behavior for remaining overflow menu entries.
- Keep localization and route wiring consistent.

**Non-Goals:**
- Redesigning tab visuals or overflow popover appearance.
- Reworking clients page content.
- Changing non-navigation business logic.

## Decisions

- Set clients tab as visible by ensuring it has normal tab `href` behavior (not hidden).
- Remove clients entry from `overflowMenuItems` source-of-truth so overflow only lists intended secondary sections.
- Reuse existing `nav.clients` label and clients route; no new route names are introduced.
- Update unit tests for tabs visibility and overflow entries to reflect new navigation contract.

## Risks / Trade-offs

- [Tab crowding] One more primary tab may reduce available label space on smaller screens -> Validate layout in mobile sizes and rely on existing icon support.
- [Regression in menu expectations] Tests and assumptions may still expect clients in overflow -> Update tests and config together.
- [Navigation inconsistency] If both tab and overflow contain clients accidentally, UX becomes redundant -> Keep single source-of-truth in overflow config and verify with tests.
