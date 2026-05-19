## Context

The Orders tab and order detail route are in place, but the detail page currently shows only high-level metadata and does not list order product lines. Users need quick visibility into which products and quantities are included in a specific order.

## Goals / Non-Goals

**Goals:**
- Render order product lines in order detail page.
- Show each line item with `name` and `amount` values.
- Keep current order detail route and top-level metadata intact.

**Non-Goals:**
- Editing product lines from order detail.
- Pricing totals or advanced formatting changes.
- Backend schema changes.

## Decisions

- Render product lines directly from existing `order.products` array in `app/order/[id].tsx`.
Rationale: no additional data fetch required and aligns with current order model.
Alternative considered: fetch products separately by id. Rejected due to unnecessary complexity.

- Add fallback empty state text if order has no products.
Rationale: prevents blank section and keeps UI understandable in edge cases.
Alternative considered: hide section entirely. Rejected because explicit state is clearer.

- Keep line rendering simple (`name` and `amount`) for fast scanning.
Rationale: matches requested scope and minimizes layout churn.
Alternative considered: richer cards with extra fields. Rejected as out of scope.

## Risks / Trade-offs

- [Missing line fields in malformed data] -> Mitigation: use safe fallbacks and resilient rendering.
- [Long product lists impact scrolling] -> Mitigation: keep compact row layout and rely on existing page scroll.
- [Localization gaps for new labels] -> Mitigation: add i18n keys for product section and empty fallback text.
