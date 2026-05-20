## Why

Order pricing currently does not consistently apply campaign-code discounts at backend calculation time, which can lead to incorrect totals and inconsistent behavior across clients. The backend must be the single source of truth for campaign validity checks and discounted line pricing.

## What Changes

- Update backend order pricing flow to fetch campaign by discount code from Firestore when code is provided.
- Validate that the campaign is active and applicable before applying it to products.
- Apply campaign discount to matching order products and store discounted value in product `finalPrice` field.
- Support both percentage and fixed campaign discount types.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `order-placement-product-validation`: Extend place-order backend validation/calculation to include code-campaign lookup, validity checks, and `finalPrice` calculation.
- `orders-tab-order-list`: Clarify order pricing output expectations so order data reflects backend-calculated discounted line pricing when valid campaign code is used.

## Impact

- Backend `placeOrder` flow and related order price calculation logic.
- Firestore campaign query/read path for discount-code campaigns.
- Order line item payload structure (`finalPrice`) and tests.
