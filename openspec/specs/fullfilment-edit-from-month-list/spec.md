# fullfilment-edit-from-month-list Specification

## Purpose
TBD - created by archiving change edit-fullfilment-from-month-list. Update Purpose after archive.
## Requirements
### Requirement: User SHALL be able to open fullfilment from monthly list
The system SHALL allow opening a fullfilment entry directly from client monthly fullfilment list.

#### Scenario: Open fullfilment edit from monthly row
- **WHEN** user taps a fullfilment row in monthly list (`activeTab === 0`)
- **THEN** system opens fullfilment edit view with that fullfilment prefilled

### Requirement: User SHALL be able to edit fullfilment fields
The system SHALL allow editing fullfilment date and line-item product data (amount and price).

#### Scenario: Save edited fullfilment
- **WHEN** user updates valid fullfilment data and saves
- **THEN** system persists edited fullfilment
- **AND** refreshes fullfilment list on client detail

### Requirement: Edit flow MUST support cancellation
The system MUST allow users to cancel editing without mutating stored data.

#### Scenario: Cancel editing
- **WHEN** user closes or cancels the edit flow before save
- **THEN** no changes are written
- **AND** client detail list remains unchanged

