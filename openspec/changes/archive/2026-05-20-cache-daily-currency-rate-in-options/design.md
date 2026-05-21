## Context

Country-based conversion has been added to products and order pricing metadata. Both currently depend on live `getRate` calls for SEK conversion. Company `options` documents are already fetched in those flows, making them a natural place to store short-lived daily currency cache.

## Goals / Non-Goals

**Goals:**
- Cache EUR->SEK daily rate in company options as `{ date, currency, rate }`.
- Use cached rate when cache date equals current date.
- Fetch and persist new rate when cache is missing or stale.
- Keep fallback behavior safe when external rate call fails.

**Non-Goals:**
- No multi-currency support beyond existing conversion path.
- No historical rate tracking beyond current daily cached value.
- No UI for managing cached currency settings.

## Decisions

- Store cache under options document in a deterministic field (e.g. `currencyRate` object).
- Cache validity check uses same calendar date (YYYY-MM-DD) in server timezone handling strategy.
- On cache miss/stale: call `getRate`, validate numeric positive rate, persist to options, then use.
- On fetch failure: use existing fallback behavior (return EUR values) without crashing response.

## Risks / Trade-offs

- [Risk] Date boundary differences (timezone) can cause early/late refresh. -> Mitigation: normalize date format and test edge cases.
- [Risk] Concurrent requests may write same rate simultaneously. -> Mitigation: idempotent overwrite with same-day rate.
- [Trade-off] Slightly more Firestore writes on first request of each day per company. -> Mitigation: one write/day/company in steady state.
