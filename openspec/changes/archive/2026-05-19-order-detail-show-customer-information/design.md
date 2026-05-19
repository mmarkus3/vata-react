## Context

Order detail already displays order metadata and product lines, but customer information is not surfaced in a dedicated section. Customer details are part of the order model and should be visible to support order verification, delivery checks, and customer support actions.

## Goals / Non-Goals

**Goals:**
- Display customer information section on order detail page.
- Render key customer fields when available.
- Provide explicit fallback text when customer info is missing.

**Non-Goals:**
- Editing customer information from order detail.
- Altering order creation schema.
- Backend contract changes for customer object.

## Decisions

- Render customer details from existing `order.customer` object in `app/order/[id].tsx`.
Rationale: avoids extra API requests and matches current order payload.
Alternative considered: fetch customer from separate collection. Rejected as out of scope.

- Show stable field set (name, email, address lines) with per-field fallback when missing.
Rationale: keeps UI predictable even with partial data.
Alternative considered: hide missing fields entirely. Rejected because blank gaps reduce clarity.

- Add section-level empty fallback when customer object is absent.
Rationale: explicit message is clearer than empty card.
Alternative considered: omit whole section. Rejected due to ambiguity.

## Risks / Trade-offs

- [Partial customer objects create uneven display] -> Mitigation: field-level fallback placeholders.
- [Localization gaps for new labels] -> Mitigation: add i18n keys for section title and field labels.
- [Layout growth on small devices] -> Mitigation: keep compact stacked typography and existing scroll behavior.
