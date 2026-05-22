## Why

New paid orders should notify the company immediately, but this notification flow is not yet automated through the mail pipeline. Adding a backend-created `recieveNotification` mail entry ensures paid-order alerts are consistently sent to the company-configured receiver.

## What Changes

- Add backend logic that creates a mail document for `recieveNotification` when a new order is created with status `paid`.
- Resolve receiver email from `options/{companyId}.email` and use it as `mail.email`.
- Send notification with title `Uusi tilaus vastaanotettu`.
- Include order id and ordered products in email body.
- Extend `onMail` handling to format and send this paid-order company notification email type.

## Capabilities

### New Capabilities
- `paid-order-company-mail-notification`: Company-facing email notification workflow for newly created paid orders.

### Modified Capabilities
- `order-sent-mail-trigger`: Extend backend mail-trigger family to support paid-order company notification document type in addition to sent-order customer notification.

## Impact

- Backend Firestore triggers in `functions/src/on-item`.
- Backend mail rendering/sending in `functions/src/on-item/mail.ts`.
- Company options lookup in Firestore for receiver resolution.
- Backend tests for trigger/mail payload and email rendering.
