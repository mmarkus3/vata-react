## Why

Order detail currently focuses on order metadata and product lines but does not clearly display customer information in one place. Showing customer details on the order detail page helps validation, delivery handling, and support workflows.

## What Changes

- Extend order detail page requirements to display customer information.
- Show key customer fields such as name, email, and address data when available.
- Define a clear fallback state when customer information is missing from an order.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `orders-tab-order-list`: Extend order detail requirements to include customer information rendering and missing-data fallback behavior.

## Impact

- Affected code likely includes `app/order/[id].tsx` and order detail helper logic.
- i18n keys likely needed for customer section labels and empty fallback text.
- Tests should cover customer info rendering and missing-customer fallback state.
