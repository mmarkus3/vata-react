## Why

Users currently cannot view orders from a dedicated navigation surface, which makes order tracking and management harder in day-to-day workflows. Adding an Orders tab with a list view improves discoverability and supports faster order operations.

## What Changes

- Add a dedicated Orders tab in app navigation.
- Provide an orders list screen in that tab showing company orders.
- Include loading, empty, and error states for the order list fetch flow.
- Support opening order details (or existing order action flow) from list items.

## Capabilities

### New Capabilities
- `orders-tab-order-list`: Add an Orders navigation tab and list view for browsing company orders with core list states and row navigation actions.

### Modified Capabilities
- None.

## Impact

- Affected code likely includes tab navigation configuration, orders screen components/hooks, and order-fetch service integration.
- API/read dependencies will include existing orders backend endpoints.
- Localization keys will need additions for Orders tab and list UI states.
