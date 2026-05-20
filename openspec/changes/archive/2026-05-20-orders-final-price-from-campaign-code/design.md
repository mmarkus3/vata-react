## Context

The order API already validates products and stock before placement. Campaigns exist with code/no-code modes and product-level discount settings. For code campaigns, backend needs deterministic pricing logic at order placement, including campaign validity checks and line-level `finalPrice` computation.

## Goals / Non-Goals

**Goals:**
- Resolve campaign by provided discount code during order placement.
- Validate campaign active window and applicability.
- Compute line `finalPrice` for matching products using fixed or percentage discount.
- Keep fallback behavior safe when campaign is missing/invalid.

**Non-Goals:**
- No campaign authoring UI changes.
- No changes to no-code auto campaign behavior in product listing.
- No changes to payment provider integration.

## Decisions

- Query campaigns by code + company and evaluate active time (`start <= now <= end`).
- Apply discount only to products included in campaign lines.
- Percentage discounts are calculated from product retail/base price used by order pipeline.
- Fixed discounts use campaign line fixed value as `finalPrice` for matching products.
- For non-matching products or invalid campaign, keep existing non-discounted final price behavior.

## Risks / Trade-offs

- [Risk] Ambiguity in source price field for percentage calculation. -> Mitigation: codify source field in implementation and tests (current order product price source).
- [Risk] Multiple campaigns with same code could produce inconsistent results. -> Mitigation: define deterministic selection (first valid or strict uniqueness validation) and test it.
- [Risk] Invalid campaign line values could break pricing. -> Mitigation: validate/skip invalid line discounts and fallback safely.
