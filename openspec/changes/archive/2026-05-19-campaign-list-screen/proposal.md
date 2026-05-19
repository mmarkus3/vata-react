## Why

Campaigns now exist in navigation, but users still need a proper list view to browse them. A dedicated campaigns listing page makes campaign visibility and access consistent with other key entities.

## What Changes

- Add capability requirements for listing campaigns in the campaigns section.
- Define loading, empty, success, and error states for campaigns list.
- Define baseline campaign row information shown in the list.

## Capabilities

### New Capabilities
- `campaign-list`: Campaign listing behavior and list-state handling in the app.

### Modified Capabilities
- None.

## Impact

- Affected frontend code likely includes `app/(home)/campaigns.tsx`, campaigns service/data access, and related UI state helpers.
- i18n keys will likely be needed for campaigns title and list states.
- Tests should cover list state behavior and basic row rendering logic.
