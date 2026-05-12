## ADDED Requirements

### Requirement: User can set retail and unit prices when creating a product
The system SHALL allow a user to enter retail price (vähittäismyyntihinta) and unit price per kilogram (kilohinta) when creating a product, and persist those values with the product.

#### Scenario: Create product with retail and unit prices
- **WHEN** a user enters valid retail and unit prices in the create-product flow and saves
- **THEN** the created product stores those retail and unit price values

#### Scenario: Create product without optional retail or unit price
- **WHEN** a user leaves retail and/or unit price empty and saves a valid product
- **THEN** the product is created successfully without requiring those optional fields

### Requirement: User can edit retail and unit prices on an existing product
The system SHALL allow a user to update retail price and unit price for an existing product and persist the updated values.

#### Scenario: Update existing product pricing fields
- **WHEN** a user edits retail and/or unit price on an existing product and saves
- **THEN** the product is updated with the new retail and unit price values

### Requirement: Retail and unit prices are returned in subsequent product reads
The system SHALL return persisted retail and unit prices in product fetches used by product detail and storage list consumers.

#### Scenario: Re-open product after pricing update
- **WHEN** a product is fetched after retail/unit price values are saved
- **THEN** the fetched product includes the saved retail and unit price values
