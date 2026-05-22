## Context

Order sent-transition has been implemented, and mail sending pipeline already exists through Firestore-driven `onMail` processing. This change connects the sent transition to mail creation and adds dedicated email content for sent-order notifications.

## Goals / Non-Goals

**Goals:**
- Create mail document when order becomes `sent`.
- Use established `mail.ts` document type and include `mail.order` = order id.
- Generate sent-email body in backend `onMail` containing order id, products, and customer details.
- Use required subject/title `Tilauksesi on lähetetty`.

**Non-Goals:**
- No generic marketing template changes.
- No localization strategy expansion beyond requested title/content.
- No shipping tracking integration.

## Decisions

- Trigger mail document creation only on transition to `sent` (not on repeated edits while already sent).
- Persist minimal but sufficient mail payload in DB (recipient, title, order id, metadata refs).
- Resolve full order data in `onMail` to compose body consistently (products + customer info).
- Keep email send logic centralized in existing mail pipeline and sender configuration.

## Risks / Trade-offs

- [Risk] Duplicate emails if sent transition is triggered repeatedly. -> Mitigation: guard against duplicate enqueue when status already `sent`.
- [Risk] Missing customer email/order fields could break message quality. -> Mitigation: fallback placeholders and validation before enqueue.
- [Trade-off] Extra Firestore write on sent transition. -> Mitigation: scoped to sent events only.
