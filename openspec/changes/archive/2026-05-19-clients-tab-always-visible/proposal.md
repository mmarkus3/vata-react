## Why

Clients are a frequent destination and currently require opening the overflow menu first. Making `Asiakkaat` directly visible in the primary tab bar reduces navigation steps and improves discoverability.

## What Changes

- Move `Asiakkaat` from overflow-only access to a visible primary tab.
- Keep overflow menu focused on secondary destinations after clients removal.
- Update navigation expectations and tests for the new tab visibility model.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `tab-overflow-menu-navigation`: Primary/secondary navigation allocation changes so `Asiakkaat` is always visible in tabs and removed from overflow menu.

## Impact

- Affected frontend files likely include tabs configuration, overflow menu configuration, and home layout behavior.
- i18n keys should remain reusable (`nav.clients`) but menu label usage changes.
- Tab/menu unit tests need updates for visible/hidden tab lists and overflow entries.
