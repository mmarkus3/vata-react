## ADDED Requirements

### Requirement: Fullfilment update removal deltas restore stock
The backend fullfilment write delta logic SHALL treat removed product lines as negative consumption and restore stock accordingly.

#### Scenario: Mixed update with removed and changed lines
- **WHEN** fullfilment update removes one product line and changes amount of another
- **THEN** backend restores removed product amount
- **AND** applies normal delta adjustment to changed product amount
