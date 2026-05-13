# product-nutrition-management Specification

## Purpose
TBD - created by archiving change add-product-nutrition-fields. Update Purpose after archive.
## Requirements
### Requirement: User can set nutrition fields when creating a product
The system SHALL allow a user to enter and save product nutrition values for `energyJoule`, `energyCalory`, `fat`, `saturatedFat`, `carbohydrate`, `saturatedCarbohydrate`, `protein`, `salt`, and `fiber` during product creation.

#### Scenario: Create product with nutrition values
- **WHEN** a user enters valid nutrition values in the product creation form and saves
- **THEN** the created product stores the entered nutrition values

#### Scenario: Create product with partial nutrition values
- **WHEN** a user leaves one or more nutrition fields empty and saves a valid product
- **THEN** the product is created successfully and only provided nutrition values are stored

### Requirement: User can edit nutrition fields on existing product
The system SHALL allow a user to edit and save nutrition values for existing products, and SHALL validate nutrition edit inputs as optional non-negative numeric values before save.

#### Scenario: Update existing product nutrition values
- **WHEN** a user edits one or more nutrition fields on an existing product and saves
- **THEN** the product is updated with the new nutrition values

#### Scenario: Save blocked for invalid nutrition edit values
- **WHEN** a user enters non-numeric or negative values in nutrition fields during product edit and attempts to save
- **THEN** the system blocks save and shows localized validation errors for invalid nutrition fields

### Requirement: Nutrition fields are returned in subsequent product reads
The system SHALL return saved nutrition values in product fetches used by product detail and storage list consumers.

#### Scenario: Re-open product after nutrition update
- **WHEN** a product is fetched after nutrition values were saved
- **THEN** the fetched product includes the saved nutrition field values

