# fullfilment-stock-sync-on-write Specification

## Purpose
TBD - created by archiving change backend-fullfilment-stock-sync-on-write. Update Purpose after archive.
## Requirements
### Requirement: Fullfilment document writes synchronize stock in backend
The backend SHALL synchronize product stock amounts on fullfilment document writes using `before` and `after` snapshot delta calculation.

#### Scenario: Fullfilment create decrements stock
- **WHEN** a fullfilment document is created with product lines
- **THEN** backend decrements each referenced product amount by created fullfilment line amounts

#### Scenario: Fullfilment update applies delta adjustments
- **WHEN** a fullfilment document is updated and product line amounts change
- **THEN** backend adjusts stock by delta between previous and current line amounts per product

#### Scenario: Fullfilment delete restores stock
- **WHEN** a fullfilment document is deleted
- **THEN** backend increments each referenced product amount by deleted fullfilment line amounts

### Requirement: Fullfilment write stock updates are atomic and validated
The backend SHALL validate product existence and stock constraints and apply fullfilment stock changes atomically.

#### Scenario: Missing product aborts fullfilment stock sync
- **WHEN** fullfilment write references a product that does not exist
- **THEN** backend aborts stock sync operation
- **AND** no product amounts are changed

#### Scenario: Invalid resulting stock aborts fullfilment stock sync
- **WHEN** fullfilment delta would result in invalid stock amounts
- **THEN** backend aborts stock sync operation
- **AND** no product amounts are changed

### Requirement: Fullfilment update removal deltas restore stock
The backend fullfilment write delta logic SHALL treat removed product lines as negative consumption and restore stock accordingly.

#### Scenario: Mixed update with removed and changed lines
- **WHEN** fullfilment update removes one product line and changes amount of another
- **THEN** backend restores removed product amount
- **AND** applies normal delta adjustment to changed product amount

