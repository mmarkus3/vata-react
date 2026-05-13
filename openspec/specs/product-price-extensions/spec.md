# product-price-extensions Specification

## Purpose
Define requirements for managing retail price and unit price fields across product create and edit flows.
## Requirements
### Requirement: User can set retail and unit prices when creating a product
The system SHALL allow a user to enter retail price (vähittäismyyntihinta) and unit price per kilogram (kilohinta) when creating a product, validate those values as optional non-negative numbers, and persist valid values with the product.

#### Scenario: Create product with retail and unit prices
- **WHEN** a user enters valid retail and unit prices in the create-product flow and saves
- **THEN** the created product stores those retail and unit price values

#### Scenario: Create product without optional retail or unit price
- **WHEN** a user leaves retail and/or unit price empty and saves a valid product
- **THEN** the product is created successfully without requiring those optional fields

#### Scenario: Create product with invalid optional pricing values
- **WHEN** a user enters non-numeric or negative retail and/or unit price values and attempts to save
- **THEN** the system blocks product creation and shows localized validation errors for the invalid pricing fields

### Requirement: User can edit retail and unit prices on an existing product
The system SHALL allow a user to update retail price and unit price for an existing product, validate those fields as optional non-negative numeric values during edit save, and persist valid updated values.

#### Scenario: Update existing product pricing fields
- **WHEN** a user edits retail and/or unit price on an existing product and saves
- **THEN** the product is updated with the new retail and unit price values

#### Scenario: Save blocked for invalid edit pricing values
- **WHEN** a user enters non-numeric or negative retail and/or unit price values in product edit flow and attempts to save
- **THEN** the system blocks save and shows localized validation errors for invalid pricing fields

### Requirement: Retail and unit prices are returned in subsequent product reads
The system SHALL return persisted retail and unit prices in product fetches used by product detail and storage list consumers.

#### Scenario: Re-open product after pricing update
- **WHEN** a product is fetched after retail/unit price values are saved
- **THEN** the fetched product includes the saved retail and unit price values

