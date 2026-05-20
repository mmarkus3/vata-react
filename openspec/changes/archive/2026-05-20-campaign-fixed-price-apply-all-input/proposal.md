## Why

Campaign fixed-price setup now requires entering a value for every product line manually. This is correct for mixed pricing, but it is slow for common cases where all campaign products should share the same fixed price.

## What Changes

- Add one shared text input in campaign fixed-price mode to set a single fixed price value for all currently targeted products.
- Keep existing per-product fixed price inputs visible and editable.
- When user applies the shared value, populate per-product fixed price inputs with that value for all current targets.
- Allow users to override individual product values after bulk apply.
- Keep existing validation and payload behavior based on per-product values.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `campaign-create`: Extend fixed-price create flow with an optional bulk-apply input that fills all per-product fixed values.
- `campaign-edit`: Extend fixed-price edit flow with the same optional bulk-apply input while preserving per-product overrides.

## Impact

- Frontend campaign form state/actions in create and edit flows.
- Campaign create/edit modal UI and validation feedback behavior.
- Campaign form tests for bulk apply, overrides, and targeting-change synchronization.
