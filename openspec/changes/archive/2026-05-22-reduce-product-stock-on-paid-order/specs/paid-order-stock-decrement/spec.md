## ADDED Requirements

### Requirement: Paid order transition decrements product stock
The backend SHALL decrement stock amounts of all products referenced by an order when order status transitions from non-`paid` to `paid`.

#### Scenario: Paid transition decrements all order lines
- **WHEN** an order status changes from `placed` to `paid`
- **THEN** backend decrements each referenced product amount by the line amount

#### Scenario: Re-updating already paid order does not decrement again
- **WHEN** an order has status `paid` before and after update
- **THEN** backend does not apply additional stock decrements

### Requirement: Paid-order stock decrement is atomic
The backend SHALL apply stock decrements as an all-or-nothing operation across all referenced order lines.

#### Scenario: Missing product aborts decrement operation
- **WHEN** paid transition includes a product id that no longer exists
- **THEN** backend aborts stock decrement operation
- **AND** no product amounts are changed

#### Scenario: Insufficient stock aborts decrement operation
- **WHEN** paid transition includes a line amount greater than available product stock
- **THEN** backend aborts stock decrement operation
- **AND** no product amounts are changed
