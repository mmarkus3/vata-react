## Why

Current bottom tabs are crowded with six primary destinations, which reduces focus and makes the most-used flows less prominent. Keeping only `Varasto`, `Tilaukset`, and `Raportti` visible and moving secondary destinations behind a menu icon improves clarity while preserving access to all sections.

## What Changes

- Redesign primary bottom navigation to keep `Varasto`, `Tilaukset`, and `Raportti` directly visible.
- Add a new menu icon entry in tab navigation that opens secondary destinations.
- Show `Asiakkaat`, `Kategoriat`, and `Profiili` from the menu after it is clicked.
- Preserve existing routes/content for these screens while changing their access pattern.

## Capabilities

### New Capabilities
- `tab-overflow-menu-navigation`: Primary-tab + overflow-menu navigation pattern for secondary sections.

### Modified Capabilities
- `orders-tab-order-list`: Update navigation requirements so Orders remains a primary visible tab in the redesigned layout.

## Impact

- Affected code includes home tab config/layout, navigation state handling for overflow menu, and menu UI component.
- i18n updates likely needed for menu labels and accessibility text.
- Navigation tests should be updated for visible tab set and overflow-item routing.
