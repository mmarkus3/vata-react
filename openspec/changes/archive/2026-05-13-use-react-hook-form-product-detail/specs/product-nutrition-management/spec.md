## MODIFIED Requirements

### Requirement: User can edit nutrition fields on existing product
The system SHALL allow a user to edit and save nutrition values for existing products, and SHALL validate nutrition edit inputs as optional non-negative numeric values before save.

#### Scenario: Update existing product nutrition values
- **WHEN** a user edits one or more nutrition fields on an existing product and saves
- **THEN** the product is updated with the new nutrition values

#### Scenario: Save blocked for invalid nutrition edit values
- **WHEN** a user enters non-numeric or negative values in nutrition fields during product edit and attempts to save
- **THEN** the system blocks save and shows localized validation errors for invalid nutrition fields
