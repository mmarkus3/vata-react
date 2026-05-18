## Why

When retail price changes, the previous price context is lost, which prevents compliant and transparent “lowest price in previous 30 days” messaging. Capturing dated retail price history enables reliable lowest-price calculations for product views.

## What Changes

- Record retail price change history with effective dates whenever `retailPrice` is updated.
- Preserve enough historical pricing data to compute and return the lowest retail price from the previous 30 days.
- Expose lowest-30-day retail price data for product read consumers so UI can display it.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `product-price-extensions`: Extend pricing requirements to include retail price history capture and 30-day lowest-price computation/read behavior.

## Impact

- Affected code will likely include product update service logic, product data model typing, and product fetch mapping used by detail/list UIs.
- Firestore product documents will include additional pricing-history fields/structure.
- Tests need updates for retail price change persistence and 30-day lowest-price calculations.
