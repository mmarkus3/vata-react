## ADDED Requirements

### Requirement: placeOrder validates referenced products exist
The backend `placeOrder` flow SHALL validate that every product referenced by the order still exists before confirming order placement.

#### Scenario: Reject placement when one referenced product is missing
- **WHEN** `placeOrder` is called and at least one order line references a product id that does not exist
- **THEN** the backend rejects the placement request
- **AND** returns an error indicating missing product reference

### Requirement: placeOrder validates stock availability for all order lines
The backend `placeOrder` flow SHALL validate that each ordered product amount is less than or equal to current product stock amount.

#### Scenario: Reject placement when stock is insufficient
- **WHEN** `placeOrder` is called and at least one order line amount exceeds current product stock amount
- **THEN** the backend rejects the placement request
- **AND** returns an error indicating insufficient stock

### Requirement: placeOrder validation is all-or-nothing
The backend SHALL not partially accept order placement when any product existence or stock validation fails.

#### Scenario: Any failing line rejects whole placement
- **WHEN** `placeOrder` request includes multiple order lines and one line fails product/stock validation
- **THEN** backend rejects the full placement request
- **AND** no order-placement success state is committed
