## 1. Daily Currency Cache Model in Options

- [x] 1.1 Define options currency-rate cache shape (`date`, `currency`, `rate`) and integrate read parsing.
- [x] 1.2 Implement same-day cache validation helper for EUR->SEK rate usage.
- [x] 1.3 Implement cache write/update to options on successful fresh fetch.

## 2. Products and Orders Integration

- [x] 2.1 Update product country conversion flow to use same-day options cache before `getRate`.
- [x] 2.2 Update orders `getPrices` conversion flow to use same-day options cache before `getRate`.
- [x] 2.3 Preserve existing EUR fallback when cache/fetch yields invalid rate.

## 3. Verification

- [x] 3.1 Add/update backend tests for cache-hit (same day) behavior without external fetch.
- [x] 3.2 Add/update tests for cache-miss/stale cache fetch-and-save behavior.
- [x] 3.3 Add/update tests for invalid/failing rate fallback and run targeted product/order backend test suites.
