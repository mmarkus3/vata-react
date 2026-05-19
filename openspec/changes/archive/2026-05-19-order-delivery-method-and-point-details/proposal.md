## Why

Order details currently do not clearly show the selected delivery method and selected pickup/delivery point information. Showing this data improves fulfillment accuracy and support workflows.

## What Changes

- Display selected `deliveryMethod` on order detail page.
- Fetch selected point information from backend API for the order point ID.
- Use `EXPO_PUBLIC_FIREBASE_API` as API base URL and endpoint path `orders/company/:company/point/:id`.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `orders-tab-order-list`: Extend order detail requirements to include delivery method and selected point information fetched from backend.

## Impact

- Affected frontend likely includes `app/order/[id].tsx`, order service layer, and order detail state helpers.
- Environment configuration dependency on `EXPO_PUBLIC_FIREBASE_API` must be respected.
- Tests should cover delivery method rendering and point-fetch success/error/fallback states.
