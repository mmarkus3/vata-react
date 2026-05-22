## 1. Paid-order notification trigger

- [x] 1.1 Add backend `onDocumentCreated` trigger for `orders/{orderId}` to handle newly created paid orders.
- [x] 1.2 Read company receiver email from `options/{companyId}.email` and create `mail` document with `recieveNotification`, `order`, `email`, and `created`.
- [x] 1.3 Add guard clauses for non-paid orders and missing receiver email with explicit logs.
- [x] 1.4 Register/export the new trigger in `functions/src/index.ts`.

## 2. Mail rendering for company notifications

- [x] 2.1 Extend `functions/src/on-item/mail.ts` to handle `recieveNotification` branch.
- [x] 2.2 Send title `Uusi tilaus vastaanotettu` and include order id + product lines (name, amount) in email body.
- [x] 2.3 Keep existing sent-order and fullfilment mail behavior unchanged.

## 3. Verification

- [x] 3.1 Add/update backend tests for paid-order trigger behavior (paid vs non-paid, receiver present vs missing).
- [x] 3.2 Add/update mail content tests for paid-order company notification title/body requirements.
- [x] 3.3 Run targeted backend/frontend tests that cover order/mail notifications and fix regressions.
