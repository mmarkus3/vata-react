## Context

Order flow exposes delivery fee and free-delivery threshold through `getPrices`. These values are stored in EUR, but client country can vary (`SE` supported). Backend already has currency conversion utilities (`getRate`) and should be the source of truth for response currency conversion.

## Goals / Non-Goals

**Goals:**
- Return `delivery` and `over` in EUR by default.
- Convert both fields to SEK when country is `SE`.
- Use `currency.getRate` for EUR->SEK conversion.
- Keep API resilient by falling back to EUR values on rate failures.

**Non-Goals:**
- No schema changes for stored option values.
- No support for additional countries in this change.
- No changes to payment capture currency in `placeOrder`.

## Decisions

- Add country parameter usage in `getPrices` logic (`FI`/non-SE -> EUR, `SE` -> SEK conversion).
- Fetch conversion rate once per request and apply to both `delivery` and `over` values.
- If rate fetch fails/invalid, return original EUR values without throwing.

## Risks / Trade-offs

- [Risk] Rate endpoint instability may lead to inconsistent SE pricing output. -> Mitigation: explicit fallback behavior + tests.
- [Trade-off] Runtime rate fetch introduces small latency. -> Mitigation: one fetch per request only.
- [Risk] Rounding differences across clients. -> Mitigation: define backend rounding approach in implementation/tests.
