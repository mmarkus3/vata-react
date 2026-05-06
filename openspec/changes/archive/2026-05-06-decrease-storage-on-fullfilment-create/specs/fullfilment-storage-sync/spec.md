## ADDED Requirements

### Requirement: Fullfilment creation SHALL decrement storage inventory
The system SHALL decrement storage product amounts for all products included in a fullfilment when the fullfilment is created.

#### Scenario: Successful fullfilment decrements all product amounts
- **WHEN** user submits a valid fullfilment containing one or more products with amounts
- **THEN** system creates the fullfilment record
- **AND** decrements each referenced product amount in storage by the submitted amount

### Requirement: Fullfilment creation SHALL fail when inventory is insufficient
The system MUST validate that all selected products have sufficient amount before committing a fullfilment.

#### Scenario: Reject fullfilment when one product has insufficient stock
- **WHEN** user submits a fullfilment where at least one selected product amount exceeds available storage amount
- **THEN** system rejects the fullfilment creation
- **AND** does not decrement any product amounts
- **AND** returns an error indicating insufficient stock

### Requirement: Fullfilment and inventory updates SHALL be atomic
The system MUST persist fullfilment creation and inventory decrements as a single atomic operation.

#### Scenario: Atomic write guarantees no partial updates
- **WHEN** an error occurs during fullfilment creation or inventory decrement
- **THEN** system commits neither the fullfilment document nor any inventory decrements
