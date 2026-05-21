## Why

Currency conversion is currently fetched from external API per request path, which may add latency and create unnecessary dependency on upstream availability. Caching daily currency rate in company options improves reliability and reduces redundant fetches.

## What Changes

- Persist fetched currency rate in company options with `date`, `currency`, and `rate` fields.
- Before fetching a new rate, use cached company option rate when cached date matches current date.
- If cached rate is missing/stale/invalid, fetch new rate, save it to options, and use it.
- Reuse this behavior in country-based pricing flows that currently call `getRate`.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `product-price-extensions`: Update country-currency conversion behavior to use same-day cached rate from company options before external fetch.
- `orders-tab-order-list`: Update `getPrices` country-currency conversion behavior to use same-day cached rate from company options before external fetch.

## Impact

- Backend options read/write path in products/orders services.
- Currency conversion utility usage pattern and request-time logic.
- Backend tests for cache-hit, cache-miss fetch/save, and stale-date handling.
