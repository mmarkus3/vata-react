## Context

Frontend-side pricing utilities already compute `lowestRetailPriceLast30Days` from current `retailPrice` plus dated `retailPriceHistory`, but this value is not guaranteed in backend API product payloads from `functions/src/products/products.service.ts`. Backend must expose this computed field directly so all API clients receive consistent pricing-compliance data.

## Goals / Non-Goals

**Goals:**
- Add backend calculation of `lowestRetailPriceLast30Days` in `functions/src/products/products.service.ts`.
- Keep calculation behavior aligned with existing React-side logic (30-day window, current price included, invalid dates ignored, null fallback).
- Return the field for both product list and product detail API responses.

**Non-Goals:**
- Changing write-time retail price history persistence behavior.
- UI rendering changes beyond consuming the API field.
- Introducing new collections or external dependencies.

## Decisions

- Copy/adapt the existing React utility algorithm into functions service scope.
Rationale: preserves behavior parity with current client logic.
Alternative considered: import client utility directly. Rejected due to cross-package/runtime coupling.

- Compute value inside shared product mapping (`buildProduct`) used by both `getProductsByCompany` and `getProductByIdAndCompany`.
Rationale: ensures consistent field presence across both API paths.
Alternative considered: compute separately in each endpoint. Rejected due to duplication risk.

- Return explicit `null` when no valid candidates exist in current/historical prices.
Rationale: stable contract and easy client handling.
Alternative considered: omit field. Rejected due to inconsistent payload shape.

## Risks / Trade-offs

- [Logic drift between React and backend implementations] -> Mitigation: mirror algorithm structure and add backend tests for parity scenarios.
- [Malformed history entries in Firestore] -> Mitigation: sanitize entries in backend calculation before deriving lowest value.
- [Edge-case date handling differences] -> Mitigation: normalize dates and compare with UTC timestamps in tests.
