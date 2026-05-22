## Why

Sent-order email creation is currently handled in client-side order status updates, which couples notification behavior to frontend code paths and risks missed notifications when status changes happen elsewhere. Moving this to backend order update triggers centralizes the rule and ensures consistent behavior whenever an order transitions to `sent`.

## What Changes

- Add a backend `onDocumentUpdated` trigger for `orders/{orderId}` that creates a `mail` document when status changes to `sent`.
- Move sent-order mail object creation responsibility from frontend/service flow to backend trigger logic.
- Ensure trigger only creates one mail entry per transition event and ignores unrelated order updates.
- Keep existing mail delivery pipeline (`onMail`) so created mail entries are sent with existing infrastructure.

## Capabilities

### New Capabilities
- `order-sent-mail-trigger`: Backend-triggered sent-order email enqueueing based on order status transitions.

### Modified Capabilities
- `orders-tab-order-list`: Order sent transition behavior changes so notification side-effect is server-side instead of client-side.

## Impact

- Affected backend code in `functions/src` for Firestore triggers and order-related event handling.
- Affected frontend/service code that currently creates `mail` documents during mark-as-sent flow.
- Improves consistency for API/admin/background status updates because notification logic no longer depends on a single client path.
