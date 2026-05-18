## Context

The product pricing flow already computes `lowestRetailPriceLast30Days` in backend/service-layer product mapping, but API response requirements need to explicitly guarantee this field is returned for product consumers. Formalizing this contract ensures consistent downstream behavior and prevents regressions where the value is omitted.

## Goals / Non-Goals

**Goals:**
- Ensure backend/API product read responses include `lowestRetailPriceLast30Days`.
- Define null/fallback behavior for products without sufficient retail-price history.
- Keep response shape backward compatible aside from adding this optional/computed field.

**Non-Goals:**
- Redesigning frontend price UI layouts.
- Changing retail price history write rules.
- Introducing new external APIs or storage systems.

## Decisions

- Treat `lowestRetailPriceLast30Days` as part of the product read contract returned by backend-facing product retrieval paths.
Rationale: Centralizes the compliance-relevant value in one source of truth.
Alternative considered: compute only in UI. Rejected due to duplication and drift risk.

- Return `null` when value cannot be computed due to missing current/historical data.
Rationale: Explicit null is safer and clearer than omitting field or sending undefined.
Alternative considered: omit field. Rejected due to inconsistent client handling.

- Cover both single-product and list-product response mapping paths with tests.
Rationale: Ensures all API consumers get a consistent contract.
Alternative considered: test only detail endpoint path. Rejected due to incomplete coverage.

## Risks / Trade-offs

- [Field present but stale if computation logic regresses] -> Mitigation: add read-mapping tests that assert value correctness and null fallback.
- [Contract ambiguity for external consumers] -> Mitigation: codify requirement in OpenSpec and keep type definitions explicit.
- [Potential null-handling issues in clients] -> Mitigation: document fallback and maintain current client-safe rendering behavior.
