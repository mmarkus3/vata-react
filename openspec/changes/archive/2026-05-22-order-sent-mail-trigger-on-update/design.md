## Context

Order sent-status notifications currently depend on frontend behavior that marks an order as sent and writes a `mail` document. This couples a business-side effect (customer notification) to one UI path and can miss notifications if order status is changed by other flows (backend tools, scripts, or future admin/API updates).

## Goals / Non-Goals

**Goals:**
- Centralize sent-order notification enqueue logic in backend Firestore triggers.
- Trigger mail creation only when an order status transitions from a non-`sent` value to `sent`.
- Keep current email-sending pipeline (`mail` collection + `onMail`) unchanged.
- Remove duplicate frontend responsibility for creating sent-order mail documents.

**Non-Goals:**
- Redesigning sent-order email template/content.
- Changing order lifecycle statuses or business rules for who can set `sent`.
- Building retries/dedup persistence beyond transition-based trigger guards.

## Decisions

- Use a dedicated `onDocumentUpdated` trigger for `orders/{orderId}` in `functions/src/on-item`.
Rationale: status transition detection requires previous and current snapshots, which update triggers provide naturally.
Alternative considered: keep frontend creation and just add more call-sites; rejected due to duplication and reliability risk.

- Create mail documents only for strict transition `before.status !== 'sent' && after.status === 'sent'`.
Rationale: prevents duplicate notifications on unrelated updates to already-sent orders.
Alternative considered: create whenever `after.status === 'sent'`; rejected because edits to sent orders would resend mail.

- Source recipient and metadata from updated order snapshot and trigger path id.
Rationale: avoids extra reads when possible and guarantees correct order id in `mail.order`.
Alternative considered: additional order re-fetch; rejected as unnecessary unless required by existing structure.

- Keep frontend `markOrderAsSent` focused on status update only.
Rationale: backend owns cross-channel side effects; client remains thin and easier to reason about.

## Risks / Trade-offs

- [Risk] Existing manual/server paths may also create `mail` documents, causing duplicates during rollout.
  → Mitigation: remove/refactor current frontend mail-creation path in same change and verify single write path.

- [Risk] Orders missing customer email will produce no actionable notification.
  → Mitigation: trigger must skip creation when email is empty and log diagnostic message.

- [Risk] Trigger failures could silently miss notifications.
  → Mitigation: add unit tests around transition guard and mail payload shape; keep function logs explicit for failures.

## Migration Plan

1. Add new backend `onDocumentUpdated` handler for sent transition mail creation.
2. Register/export handler in `functions/src/index.ts`.
3. Refactor client/service sent-order flow to stop writing `mail` documents directly.
4. Add/update tests for backend trigger transition logic and frontend/service regression.
5. Deploy functions and app together to avoid split-brain behavior.

Rollback strategy:
- Revert trigger export and re-enable previous frontend mail creation path if rollback is required.

## Open Questions

- Should sent-notification deduplication also be enforced by marker field on order (e.g., `sentMailCreatedAt`) for stronger idempotency across rare replays?
- Should notification enqueue be extended to other statuses (`placed`, `paid`) in follow-up changes?
