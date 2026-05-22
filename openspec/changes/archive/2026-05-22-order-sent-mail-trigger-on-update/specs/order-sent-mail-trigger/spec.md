## ADDED Requirements

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
