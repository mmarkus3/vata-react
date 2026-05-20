## 1. Campaign Code Pricing in Place Order

- [x] 1.1 Identify place-order pricing path and current `finalPrice` assignment logic.
- [x] 1.2 Fetch campaign by discount code from Firestore in backend order placement flow.
- [x] 1.3 Validate campaign active date range and applicability before pricing.
- [x] 1.4 Apply percentage/fixed campaign line discount to matching products and write `finalPrice`.

## 2. Validation and Fallback Behavior

- [x] 2.1 Keep existing product existence and stock validation behavior intact.
- [x] 2.2 Preserve safe fallback behavior for invalid/inactive/non-matching campaign code cases.
- [x] 2.3 Ensure non-campaign products in mixed orders keep non-discounted `finalPrice`.

## 3. Verification

- [x] 3.1 Add/update backend tests for valid percentage and fixed campaign code pricing.
- [x] 3.2 Add/update tests for invalid/expired campaign code and non-matching product scenarios.
- [x] 3.3 Run targeted order backend tests and resolve regressions.
