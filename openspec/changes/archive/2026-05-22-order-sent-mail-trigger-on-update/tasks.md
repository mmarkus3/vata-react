## 1. Backend sent-transition trigger

- [x] 1.1 Add new Firestore `onDocumentUpdated` handler for `orders/{orderId}` under `functions/src/on-item`.
- [x] 1.2 Implement transition guard (`before.status !== 'sent' && after.status === 'sent'`) and create `mail` document payload with `email`, `order`, and `created`.
- [x] 1.3 Skip mail creation when customer email is missing/blank and add clear logging.
- [x] 1.4 Export/register the new trigger in `functions/src/index.ts`.

## 2. Frontend/service refactor

- [x] 2.1 Remove direct sent-mail document creation from client/service sent-order flow.
- [x] 2.2 Keep mark-as-sent path responsible only for order status update and existing validation.

## 3. Verification

- [x] 3.1 Add/update backend tests for transition-to-sent mail creation, non-sent updates, and already-sent updates.
- [x] 3.2 Update frontend/service tests to assert no direct mail creation from mark-as-sent flow.
- [x] 3.3 Run targeted frontend and backend Jest tests and fix regressions.
