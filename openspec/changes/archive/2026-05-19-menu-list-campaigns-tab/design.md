## Context

Home navigation uses a focused three-tab layout (`Varasto`, `Tilaukset`, `Raportti`) with secondary destinations exposed via a popover menu. Existing secondary options are `Asiakkaat`, `Kategoriat`, and `Profiili`. Campaign management should be reachable through the same overflow mechanism without reintroducing a full-screen menu.

## Goals / Non-Goals

**Goals:**
- Add `Kampanjat` as a visible option in the overflow popover list.
- Preserve current primary tab layout and popover interaction behavior.
- Ensure selecting the new option navigates to the campaigns screen route.
- Keep localization-driven labels consistent with existing menu items.

**Non-Goals:**
- Redesigning tab visuals or popover layout.
- Introducing campaign creation/editing behavior in this change.
- Changing existing primary tabs or their ordering.

## Decisions

- Update the overflow menu option source-of-truth (config/state helper) to include a campaigns item alongside existing entries.
- Reuse the existing route navigation pattern used by `Asiakkaat`, `Kategoriat`, and `Profiili` so behavior stays consistent.
- Use i18next key-based label (`nav.campaigns`) rather than hard-coded text, adding the key only if missing.
- Extend existing menu-related Jest tests to cover the new item presence and route mapping.

## Risks / Trade-offs

- [Route mismatch] Campaigns route constant may differ from assumed route name -> Verify existing campaigns screen route before wiring menu item.
- [Localization gap] Missing key can cause fallback/blank text -> Add `nav.campaigns` in supported locale files if needed.
- [Regression in menu tests] Snapshot or strict option count assertions may fail -> Update tests to assert expected expanded list.
