## Why

Orders may belong to different destination countries, but users currently can’t easily distinguish non-default-country orders in list/detail views. Showing country only when it differs from default `FI` improves visibility without cluttering the UI.

## What Changes

- Show order country in orders list rows when country is present and not `FI`.
- Show order country in order detail view when country is present and not `FI`.
- Keep existing UI unchanged for default `FI` orders.
- Use localized label/text for country display.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `orders-tab-order-list`: Extend list/detail presentation rules to conditionally display order country when non-default (`!= FI`).

## Impact

- Frontend order list row rendering.
- Frontend order detail rendering.
- Order view-model/selector logic for conditional country visibility.
- UI tests/snapshots for non-FI and FI cases.
