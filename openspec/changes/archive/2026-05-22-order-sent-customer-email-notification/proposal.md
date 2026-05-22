## Why

Customers currently do not receive a confirmation email when their order is marked as sent. Automated sent-notification improves customer communication and reduces support questions.

## What Changes

- When order status is updated to `sent`, create a new mail document in DB using `mail.ts` type contract.
- Store order identifier in `mail.order` field.
- Extend backend `onMail` processing to construct sent-order email body.
- Email must include order id, product list, and customer information.
- Email title must be exactly: `Tilauksesi on lähetetty`.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `orders-tab-order-list`: Extend sent-order workflow to enqueue customer email notification when order is marked sent.
- `order-placement-product-validation`: Extend backend sent-status transition behavior to trigger mail document creation and mail content generation through `onMail` path.

## Impact

- Frontend/order status transition path that marks order as sent.
- Mail document creation service/model (`mail.ts`) and write payload shape.
- Backend `on-item/mail.ts` email template/body assembly logic.
- Tests for mail document creation trigger and generated email content fields.
