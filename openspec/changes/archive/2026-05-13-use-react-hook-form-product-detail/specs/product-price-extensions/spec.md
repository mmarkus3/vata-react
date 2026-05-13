## MODIFIED Requirements

### Requirement: User can edit retail and unit prices on an existing product
The system SHALL allow a user to update retail price and unit price for an existing product, validate those fields as optional non-negative numeric values during edit save, and persist valid updated values.

#### Scenario: Update existing product pricing fields
- **WHEN** a user edits retail and/or unit price on an existing product and saves
- **THEN** the product is updated with the new retail and unit price values

#### Scenario: Save blocked for invalid edit pricing values
- **WHEN** a user enters non-numeric or negative retail and/or unit price values in product edit flow and attempts to save
- **THEN** the system blocks save and shows localized validation errors for invalid pricing fields
