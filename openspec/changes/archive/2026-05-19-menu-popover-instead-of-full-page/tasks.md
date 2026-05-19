## 1. Navigation Interaction Refactor

- [x] 1.1 Remove full-page menu-route dependency from tab interaction flow.
- [x] 1.2 Add popover open/close state handling triggered by menu icon tab action.
- [x] 1.3 Render secondary options (`Asiakkaat`, `Kategoriat`, `Profiili`) inside popover overlay.

## 2. Dismissal and Routing Behavior

- [x] 2.1 Close popover on outside tap/backdrop interaction.
- [x] 2.2 Close popover after selecting a menu option and navigate to existing target route.
- [x] 2.3 Ensure popover does not remain open when switching to another primary tab.

## 3. Localization and Tests

- [x] 3.1 Keep/update i18n labels used by menu trigger/popover entries.
- [x] 3.2 Add/update tests for popover visibility toggle behavior (open/close).
- [x] 3.3 Add/update tests for secondary menu item presence and route mapping.
