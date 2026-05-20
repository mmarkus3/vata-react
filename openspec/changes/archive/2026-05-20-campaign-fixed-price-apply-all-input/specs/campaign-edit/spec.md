## MODIFIED Requirements

### Requirement: User can save valid campaign edits
The system SHALL persist campaign updates when edit form passes validation.

#### Scenario: Successful campaign update
- **WHEN** user edits campaign with valid values and saves
- **THEN** system updates campaign by ID and closes modal

#### Scenario: Apply same fixed price to all targeted products during edit
- **WHEN** user enters one fixed price in the shared bulk input and applies it in fixed-price mode
- **THEN** system populates fixed price for every currently targeted product line before save

#### Scenario: Invalid campaign update blocked
- **WHEN** user edits campaign with invalid values
- **THEN** system shows validation error and does not persist updates

#### Scenario: Invalid per-product fixed prices blocked
- **WHEN** campaign fixed-price mode has missing or invalid per-product fixed values
- **THEN** system blocks save and shows validation error
