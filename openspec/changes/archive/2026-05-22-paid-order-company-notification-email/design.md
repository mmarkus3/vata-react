## Context

The system already sends customer-facing mail when orders transition to `sent`, and a generic `mail` collection + `onMail` function exists for email dispatch. Paid-order notifications to the company need to be added using the same pipeline, with receiver address resolved from company options.

## Goals / Non-Goals

**Goals:**
- Enqueue a `recieveNotification` mail document when a new order is created in `paid` status.
- Resolve receiver email from `options/{companyId}.email`.
- Build email content titled `Uusi tilaus vastaanotettu` with order id and product list.
- Reuse existing mail sending infrastructure and keep behavior modular.

**Non-Goals:**
- Changing payment state machine or order status transitions.
- Implementing multi-recipient or per-company template customization.
- Refactoring historical misspelling `recieveNotification` in this change.

## Decisions

- Add a dedicated `onDocumentCreated` order trigger for paid-order company notifications.
Rationale: requirement explicitly targets new paid orders, making create trigger the clearest fit.
Alternative considered: using update trigger with transition checks; rejected to avoid overlap with existing sent update trigger and to keep logic single-purpose.

- Use `mail.recieveNotification` field to identify notification type in `onMail`.
Rationale: matches current requested contract and allows `onMail` branching by intent.
Alternative considered: adding enum-like `type` field; rejected for now to avoid broad schema migration.

- Lookup recipient from company document options.
Rationale: company-level configuration is the source of truth for notification receiver.
Alternative considered: derive from order/customer fields; rejected because recipient is internal company contact, not customer.

- Include compact product table in mail body with product name and amount plus order id headline.
Rationale: satisfies requirement and keeps email readable/actionable.

## Risks / Trade-offs

- [Risk] `options.email` missing or invalid leads to skipped notifications.
  → Mitigation: validate receiver presence before mail creation and log explicit warning.

- [Risk] Trigger duplication if multiple mechanisms add paid-order notification later.
  → Mitigation: isolate logic in one trigger module and document ownership in tests/spec.

- [Risk] Typo field `recieveNotification` can cause confusion in future work.
  → Mitigation: keep naming consistent in this change and consider rename migration in a separate change.

## Migration Plan

1. Add backend trigger for paid order create event.
2. Read company options email and create `mail` doc with `recieveNotification` + order reference.
3. Extend `onMail` to render/send paid-order notification email with required title/content.
4. Add tests for trigger guards, receiver lookup, and mail body construction.
5. Deploy functions.

Rollback strategy:
- Remove trigger export and paid-notification branch from `onMail`; existing sent-notification behavior remains intact.

## Open Questions

- Should notifications also trigger for orders created as non-paid and later updated to paid in future?
- Should company notification include customer details in addition to products and order id?
