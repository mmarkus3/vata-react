# paid-order-company-mail-notification Specification

## Purpose
TBD - created by archiving change paid-order-company-notification-email. Update Purpose after archive.
## Requirements
### Requirement: New paid order creates company notification mail entry
The backend SHALL create a `mail` document for `recieveNotification` when a new order is created with status `paid`.

#### Scenario: Paid order create enqueues notification mail
- **WHEN** a new `orders/{orderId}` document is created with status `paid`
- **THEN** backend creates one `mail` document containing `recieveNotification` and `order` set to `{orderId}`

#### Scenario: Non-paid order create does not enqueue notification
- **WHEN** a new order is created with status other than `paid`
- **THEN** backend does not create paid-order company notification mail

### Requirement: Receiver email comes from options document
The backend SHALL resolve the paid-order notification recipient from `options/{companyId}.email`.

#### Scenario: Company options email exists
- **WHEN** paid-order notification is enqueued
- **THEN** `mail.email` is set to the value of `options/{companyId}.email`

#### Scenario: Company options email missing
- **WHEN** paid-order notification would be enqueued but company options email is missing or blank
- **THEN** backend skips mail creation

