## Why

Order lists become harder to use as volume grows, especially when users need to find one specific order quickly. Adding text-based filtering by order id and customer identity reduces lookup time and improves daily order handling.

## What Changes

- Add order list filtering by order id.
- Add order list filtering by customer name and customer email.
- Apply filtering within the currently selected status segment (`placed`, `paid`, `sent`).
- Keep existing sort behavior (oldest first) and list states while filtered.

## Capabilities

### New Capabilities
- `orders-search-filter`: Client-side text filtering behavior for order list using order id and customer fields.

### Modified Capabilities
- `orders-tab-order-list`: Extend order list requirements with order id / customer name / customer email filter behavior.

## Impact

- Frontend orders tab UI and list-state helpers.
- Potential i18n strings for filter input label/placeholder and empty-filtered state text.
- Frontend tests for filter matching and segment interplay.
