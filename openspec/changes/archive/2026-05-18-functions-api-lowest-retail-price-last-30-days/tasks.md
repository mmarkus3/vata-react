## 1. Backend Calculation Implementation

- [x] 1.1 Add retail-price-history sanitization and 30-day lowest-price calculation helpers to `functions/src/products/products.service.ts` (copied/adapted from React-side logic).
- [x] 1.2 Compute `lowestRetailPriceLast30Days` in the shared product mapper (`buildProduct`) so both list and detail paths use identical logic.
- [x] 1.3 Ensure malformed history entries are ignored safely and that no `undefined` value is emitted in API payloads.

## 2. API Response Contract

- [x] 2.1 Extend backend product response type/interface in `functions/src/products` to include nullable `lowestRetailPriceLast30Days`.
- [x] 2.2 Verify `getProductsByCompany` responses include `lowestRetailPriceLast30Days` for each returned product.
- [x] 2.3 Verify `getProductByIdAndCompany` responses include `lowestRetailPriceLast30Days` for returned product.

## 3. Verification

- [x] 3.1 Add/update backend unit tests for detail response mapping including computed `lowestRetailPriceLast30Days`.
- [x] 3.2 Add/update backend unit tests for list response mapping including computed `lowestRetailPriceLast30Days`.
- [x] 3.3 Add/update backend unit tests for null fallback when current/historical retail price data cannot produce a 30-day lowest value.
