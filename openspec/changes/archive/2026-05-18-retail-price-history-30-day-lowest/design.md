## Context

The product domain currently stores only the latest retail price, so once a price changes there is no auditable timeline to derive regulatory-style “lowest price in previous 30 days” information. This change needs data model and service updates so every retail price change can be tracked with date metadata and used in downstream product reads.

## Goals / Non-Goals

**Goals:**
- Persist previous retail prices with date context whenever `retailPrice` changes.
- Make 30-day lowest retail price derivable and available in product reads.
- Keep behavior backward compatible for products with no prior retail-price history.

**Non-Goals:**
- Implementing UI copy/layout details for lowest-price labels.
- Changing amount/base price/unit price semantics.
- Backfilling complete historical prices beyond available current data.

## Decisions

- Store a bounded retail-price history on product documents as dated entries (value + effective date metadata).
Rationale: This keeps read computation local to the product and avoids cross-collection joins.
Alternative considered: separate price-history collection. Rejected for current scope/complexity.

- On product update, append history only when `retailPrice` value actually changes.
Rationale: Prevents noisy duplicate entries and keeps history meaningful.
Alternative considered: append on every save. Rejected due to redundant writes.

- Compute `lowestRetailPriceLast30Days` from current retail price plus history entries in the prior 30-day window and expose it in mapped product reads.
Rationale: Ensures consumers can display lowest-30-day value without re-implementing pricing-window logic.
Alternative considered: compute only in UI. Rejected due to duplication and consistency risk.

- Keep legacy products safe by treating missing history as “no historical data,” while still returning current retail price.
Rationale: Enables gradual rollout without migration blocker.
Alternative considered: mandatory migration before release. Rejected to reduce rollout risk.

## Risks / Trade-offs

- [History growth increases document size] -> Mitigation: bound stored entries to a practical retention window (for example latest N days/entries) during updates.
- [Clock/date consistency issues] -> Mitigation: normalize timestamps in service layer and compare using UTC-based date math.
- [Incorrect lowest-price calculation if history missing] -> Mitigation: define fallback behavior clearly and cover with tests for no-history and partial-history products.
