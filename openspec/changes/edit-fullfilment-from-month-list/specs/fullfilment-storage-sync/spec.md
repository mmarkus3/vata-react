## MODIFIED Requirements

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
