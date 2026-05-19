## Why

Order detail currently does not clearly list ordered products with their quantities, which makes verification and fulfillment checks harder. Showing product name and amount directly in order detail improves clarity and reduces mistakes.

## What Changes

- Update order detail page requirements to display ordered product line items.
- Show each ordered line with product `name` and `amount`.
- Preserve existing order detail route and metadata behavior while extending detail content.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `orders-tab-order-list`: Extend order detail behavior to include product line list rendering (`name`, `amount`).

## Impact

- Affected code likely includes `app/order/[id].tsx` and related order UI helpers.
- May require i18n keys for section labels/empty fallback text.
- Tests should validate product line rendering on order detail page.
