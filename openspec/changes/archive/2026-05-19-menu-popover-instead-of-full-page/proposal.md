## Why

The current menu interaction opens a full page, which adds an unnecessary navigation step and context switch for quick access actions. Using a popover from the menu icon keeps users in place and makes secondary navigation feel faster.

## What Changes

- Change menu-icon behavior from full-page navigation to an in-place popover.
- Keep popover options as `Asiakkaat`, `Kategoriat`, and `Profiili`.
- Preserve existing destination routes for each option.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `tab-overflow-menu-navigation`: Update menu trigger behavior to open/close a popover rather than navigating to a full menu screen.

## Impact

- Affected code likely includes home tab layout/config and menu UI implementation.
- Existing `clients`, `categories`, and `settings` routes remain unchanged.
- Tests need updates for popover visibility toggling and item route mapping.
