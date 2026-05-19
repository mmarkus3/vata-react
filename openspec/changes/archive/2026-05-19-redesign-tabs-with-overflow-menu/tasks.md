## 1. Tab Layout Redesign

- [x] 1.1 Update home tab config so `Varasto`, `Tilaukset`, and `Raportti` remain the only directly visible primary tabs.
- [x] 1.2 Add a new menu-icon tab action entry to trigger secondary navigation options.

## 2. Overflow Menu Behavior

- [x] 2.1 Implement menu UI opened by menu icon tap with options: `Asiakkaat`, `Kategoriat`, `Profiili`.
- [x] 2.2 Wire menu option presses to existing `clients`, `categories`, and `settings` routes.
- [x] 2.3 Ensure menu open/close behavior is consistent and accessible on mobile and web.

## 3. Localization and UX

- [x] 3.1 Add/update i18n labels for menu trigger and secondary menu items as needed.
- [x] 3.2 Verify navigation still preserves existing screen titles/routes for moved sections.

## 4. Tests

- [x] 4.1 Add/update navigation config tests to assert visible primary tabs include `Varasto`, `Tilaukset`, and `Raportti`.
- [x] 4.2 Add/update tests for menu-trigger visibility and overflow item presence.
- [x] 4.3 Add/update tests for overflow item route mapping to `clients`, `categories`, and `settings`.
