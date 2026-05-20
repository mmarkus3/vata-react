## Context

Campaign data already supports auto-applied campaigns (without code) and per-product discount definitions. Product APIs need to expose an effective `discountPrice` derived from active campaigns so all clients use one backend source of truth. The requested behavior must resolve conflicts when multiple active campaigns affect the same product by selecting the lowest resulting price.

## Goals / Non-Goals

**Goals:**
- Compute and return `discountPrice` in product API responses when active code-less campaigns apply.
- Calculate percentage discounts from product `retailPrice`.
- For multiple applicable campaigns, pick the minimum resulting price.
- Keep behavior deterministic and test-covered.

**Non-Goals:**
- No campaign authoring UI changes.
- No new campaign model fields.
- No changes to coded-campaign checkout flow.

## Decisions

- Determine campaign applicability using:
  - campaign has no code (auto mode)
  - campaign is active for current server time (`start <= now <= end`)
  - product ID is in campaign product lines.
- For each applicable campaign line, calculate candidate price:
  - `fixed`: candidate is campaign line fixed price.
  - `percentage`: candidate is `retailPrice * (1 - percentage / 100)`.
- Return the smallest valid candidate as `discountPrice`.
- If no campaign candidates exist, omit/leave `discountPrice` unchanged per existing API contract.
- Guard against invalid data (missing/invalid retail price or discount value) by skipping invalid candidates.

## Risks / Trade-offs

- [Risk] Different rounding between backend and client can cause minor display mismatches. -> Mitigation: centralize rounding policy in backend mapper and test exact outputs.
- [Risk] Additional campaign lookups can impact list endpoint performance. -> Mitigation: reuse batch fetches/caching in request scope and avoid per-product redundant queries.
- [Trade-off] Lowest-price selection may differ from campaign priority expectations. -> Mitigation: codify this as explicit API contract in specs and tests.
