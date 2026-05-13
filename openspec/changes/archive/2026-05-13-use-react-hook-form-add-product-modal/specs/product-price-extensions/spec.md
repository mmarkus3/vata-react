## MODIFIED Requirements

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
