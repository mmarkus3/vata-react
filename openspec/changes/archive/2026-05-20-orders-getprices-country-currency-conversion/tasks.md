## 1. getPrices Country Currency Logic

- [x] 1.1 Identify current `getPrices` response fields (`over`, `delivery`) and country input path.
- [x] 1.2 Integrate `currency.getRate` into `getPrices` for country `SE`.
- [x] 1.3 Apply EUR->SEK conversion to both `over` and `delivery` when country is `SE`.

## 2. Fallback and Compatibility

- [x] 2.1 Preserve EUR default behavior for non-SE countries.
- [x] 2.2 Add safe fallback to EUR values when rate fetch fails or is invalid.
- [x] 2.3 Ensure response shape remains compatible with existing clients.

## 3. Verification

- [x] 3.1 Add/update backend tests for EUR default and SE conversion cases in `getPrices`.
- [x] 3.2 Add/update backend tests for rate-failure fallback behavior.
- [x] 3.3 Run targeted backend order service tests and resolve regressions.
