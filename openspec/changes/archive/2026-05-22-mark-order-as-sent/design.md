## Context

Order status values already include `sent`, and order update endpoints exist. Current UI does not provide an explicit “mark sent” action from order workflow screens. The change is primarily a workflow action and state refresh integration between frontend and existing backend update functionality.

## Goals / Non-Goals

**Goals:**
- Provide a visible action to mark eligible orders as `sent`.
- Persist status transition through existing backend update route.
- Refresh list/detail views after successful status change.

**Non-Goals:**
- No new status values.
- No shipping label/tracking integration.
- No redesign of entire order detail page.

## Decisions

- Add action button in order detail view when status is not already `sent`.
- Use existing order patch/update API with `{ status: 'sent' }` payload.
- Keep backend company validation and existing update restrictions.
- Disable or hide action while request is in-flight to prevent duplicate submissions.

## Risks / Trade-offs

- [Risk] Multiple users updating same order concurrently. -> Mitigation: rely on backend latest-write semantics and refresh after update.
- [Risk] Status update failure leaves stale UI. -> Mitigation: show error feedback and keep action available for retry.
- [Trade-off] Detail-screen-only action may require extra taps from list view. -> Mitigation: maintain simple first step; list quick-action can be future enhancement.
