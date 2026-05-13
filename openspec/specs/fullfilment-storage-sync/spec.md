# fullfilment-storage-sync Specification

## Purpose
TBD - created by archiving change decrease-storage-on-fullfilment-create. Update Purpose after archive.
## Requirements
### Requirement: Fullfilment creation SHALL decrement storage inventory
The system SHALL decrement storage product amounts for all products included in a fullfilment when the fullfilment is created.

#### Scenario: Successful fullfilment decrements all product amounts
- **WHEN** user submits a valid fullfilment containing one or more products with amounts
- **THEN** system creates the fullfilment record
- **AND** decrements each referenced product amount in storage by the submitted amount
- **AND** stores the selected line-item price for each fullfilment product

### Requirement: Fullfilment creation SHALL fail when inventory is insufficient
The system MUST validate that all selected products have sufficient amount before committing a fullfilment.

#### Scenario: Reject fullfilment when one product has insufficient stock
- **WHEN** user submits a fullfilment where at least one selected product amount exceeds available storage amount
- **THEN** system rejects the fullfilment creation
- **AND** does not decrement any product amounts
- **AND** returns an error indicating insufficient stock

### Requirement: Fullfilment and inventory updates SHALL be atomic
The system MUST persist fullfilment creation or fullfilment edits and related inventory adjustments as a single atomic operation.

#### Scenario: Atomic write guarantees no partial updates
- **WHEN** an error occurs during fullfilment create/edit inventory adjustment
- **THEN** system commits neither fullfilment changes nor any inventory decrements/increments

### Requirement: Fullfilment edit SHALL adjust inventory by delta
The system MUST recalculate inventory changes based on difference between original and edited fullfilment product amounts.

#### Scenario: Edited amount increases consumption
- **WHEN** user edits a fullfilment and increases amount for a product
- **THEN** system decrements storage by the increase delta

#### Scenario: Edited amount decreases consumption
- **WHEN** user edits a fullfilment and decreases amount for a product
- **THEN** system increments storage by the decrease delta

#### Scenario: Product removed or added during edit
- **WHEN** user removes or adds a product line in fullfilment edit
- **THEN** system restores or decrements inventory accordingly for removed/added lines

