## 1. placeOrder Product Validation

- [x] 1.1 Inspect order line-item schema used by `functions/src/orders/orders.service.ts` `placeOrder` and identify product id + amount fields.
- [x] 1.2 Add product existence checks for every referenced order-line product during `placeOrder`.
- [x] 1.3 Add stock-availability checks ensuring requested amount does not exceed current product stock amount.
- [x] 1.4 Return clear validation errors for missing product references and insufficient stock conditions.

## 2. Placement Safety

- [x] 2.1 Ensure validation is all-or-nothing: any failing line rejects the whole placement.
- [x] 2.2 Ensure no success placement state is committed when validation fails.

## 3. Tests

- [x] 3.1 Add/update `orders.service` unit tests for missing-product rejection.
- [x] 3.2 Add/update `orders.service` unit tests for insufficient-stock rejection.
- [x] 3.3 Add/update `orders.service` unit tests confirming successful placement path when all products exist and stock is sufficient.
