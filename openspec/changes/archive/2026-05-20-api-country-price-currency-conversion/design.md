## Context

Product API responses currently return base EUR values for pricing fields. A company-level country setting exists and should control pricing currency in responses. A currency service provides `getRate` for conversion, and backend should use that instead of frontend-side conversion.

## Goals / Non-Goals

**Goals:**
- Return EUR prices by default.
- Convert product price fields to SEK when company country is `SE`.
- Use `currency.getRate` as conversion source.
- Keep behavior deterministic and testable.

**Non-Goals:**
- No database schema migrations for stored prices.
- No changes to campaign authoring logic.
- No support for countries beyond EUR default + SE in this change.

## Decisions

- Resolve company country in backend product request path.
- For `SE`, fetch EUR->SEK rate via `getRate` once per request and apply to exposed product price fields.
- Keep original persistence currency in DB unchanged (EUR), conversion happens at response mapping layer.
- If conversion rate retrieval fails, fallback to EUR values to avoid API hard failures.

## Risks / Trade-offs

- [Risk] Rate API failures can produce inconsistent user expectations. -> Mitigation: explicit fallback behavior and logging.
- [Risk] Rounding differences across clients. -> Mitigation: centralize rounding policy in backend mapper.
- [Trade-off] Runtime rate fetch adds latency. -> Mitigation: fetch rate once per request and reuse for all returned products.
