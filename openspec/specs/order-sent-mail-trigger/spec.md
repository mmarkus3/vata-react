# order-sent-mail-trigger Specification

## Purpose
TBD - created by archiving change order-sent-mail-trigger-on-update. Update Purpose after archive.
## Requirements
### Requirement: Backend enqueues sent-order customer mail on status transition
The system SHALL create a `mail` document from backend order update trigger logic when an order status transitions from any non-`sent` status to `sent`.

#### Scenario: Transition to sent creates mail document
- **WHEN** an `orders/{orderId}` document is updated and status changes from `paid` to `sent`
- **THEN** backend creates one `mail` document with recipient email and `order` set to `{orderId}`

#### Scenario: Non-sent status change does not create mail
- **WHEN** an order status changes without resulting in `sent`
- **THEN** backend does not create a `mail` document for sent notification

#### Scenario: Update to already sent order does not duplicate mail
- **WHEN** an order has status `sent` before update and remains `sent` after update
- **THEN** backend does not create an additional sent-notification `mail` document

### Requirement: Trigger validates recipient before enqueue
The system SHALL only enqueue sent-order mail when order customer email is present and non-empty.

#### Scenario: Missing customer email skips enqueue
- **WHEN** order transitions to `sent` and customer email is missing or blank
- **THEN** backend skips mail document creation

### Requirement: onMail renders paid-order company notification
The mail processing function SHALL support `recieveNotification` order notification emails and send them with title `Uusi tilaus vastaanotettu`.

#### Scenario: Paid-order company notification email is sent
- **WHEN** a `mail` document has `recieveNotification` and valid `order` reference
- **THEN** system sends an email titled `Uusi tilaus vastaanotettu`
- **AND** email body includes order id and product lines (name and amount)

#### Scenario: Missing order for recieveNotification is handled safely
- **WHEN** `recieveNotification` mail is processed but referenced order is missing
- **THEN** system does not send email and logs an error

### Requirement: Shared order update trigger handles paid stock side effect
The backend order update trigger SHALL process paid-transition stock decrement side effects in addition to existing notification behavior.

#### Scenario: Paid transition executes stock decrement and paid notification logic
- **WHEN** an order transitions to `paid`
- **THEN** backend evaluates and applies product stock decrements
- **AND** backend continues paid-notification mail flow per existing requirements

