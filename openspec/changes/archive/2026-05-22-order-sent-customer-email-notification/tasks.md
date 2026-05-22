## 1. Sent Transition Mail Enqueue

- [ ] 1.1 Identify sent status transition path and add mail document creation using `mail.ts` type.
- [ ] 1.2 Populate mail payload with recipient, title `Tilauksesi on lähetetty`, and `mail.order` order id.
- [ ] 1.3 Guard against duplicate enqueue when order is already sent.

## 2. Backend onMail Email Body

- [ ] 2.1 Update `on-item/mail.ts` to recognize sent-order mail type/context.
- [ ] 2.2 Build email body including order id, customer information, and product lines.
- [ ] 2.3 Keep existing sender/transport flow and fallback safety behavior.

## 3. Verification

- [ ] 3.1 Add/update tests for sent transition creating correct mail document shape.
- [ ] 3.2 Add/update tests for generated sent-email title/body content fields.
- [ ] 3.3 Run targeted order + mail backend/frontend tests and resolve regressions.
