## Why

The overflow menu currently exposes secondary navigation items but does not include campaigns. Adding a `Kampanjat` entry makes campaign workflows discoverable from the same menu pattern users already use for secondary sections.

## What Changes

- Extend overflow menu options to include `Kampanjat`.
- Ensure selecting `Kampanjat` navigates to the campaigns route.
- Add/confirm localization key usage for the campaigns menu label.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `tab-overflow-menu-navigation`: Add `Kampanjat` to secondary overflow menu options and navigation behavior.

## Impact

- Affected frontend code likely includes home tab overflow menu config/state and route mapping.
- i18n navigation labels may need updates if `nav.campaigns` is missing.
- Tests for overflow menu options and navigation should be updated.
