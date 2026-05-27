## ADDED Requirements

### Requirement: User can import available product details from a JSON file
The system SHALL allow a user in product detail edit mode to select a JSON file represented by the `ProductImport` structure and populate only available values that correspond to fields already supported by the existing product edit workflow.

#### Scenario: User imports a valid product JSON file
- **WHEN** a user selects a valid product JSON file while editing a product
- **THEN** the system parses it as product import data and populates supported available product detail values for user review before saving

#### Scenario: Source data does not include an importable value
- **WHEN** a valid selected JSON file omits a usable source value for an existing product field
- **THEN** the system leaves the current value of that product field unchanged

#### Scenario: User selects an invalid JSON file
- **WHEN** a user selects malformed JSON or JSON without a usable trade-item payload
- **THEN** the system displays localized import error feedback
- **AND** does not modify current editable product values

### Requirement: Import maps only equivalent existing product fields
The system SHALL map available imported values only to existing `Product` destinations: name, EAN, images, country of origin, localized ingredient text, localized description text and supported nutrition values.

#### Scenario: Product identity and localized content are available
- **WHEN** the imported trade item contains GTIN, origin, localized descriptions, localized ingredient statements or suitable product name text
- **THEN** the system maps available values to `ean`, `countryOfOrigin`, corresponding `description_*`, corresponding `ingredients_*` and `name` edit values

#### Scenario: Referenced product images are available
- **WHEN** the imported trade item contains usable referenced image URLs
- **THEN** the system merges unique imported image URLs into the existing product images without removing currently retained images

#### Scenario: Supported nutrition values are available
- **WHEN** the imported trade item contains compatible nutrient quantities for energy, fat, saturated fat, carbohydrate, sugars, protein, salt or fiber
- **THEN** the system maps them to the corresponding existing nutrition edit values
- **AND** maps a sugars quantity to the existing `saturatedCarbohydrate` value presented as sugars in the user interface

### Requirement: Product JSON import does not expand persisted product data
The system MUST ignore imported values that have no corresponding existing product field and SHALL save imported changes only through the current product update workflow.

#### Scenario: Imported payload includes source-only fields
- **WHEN** a selected JSON payload contains packaging, classification, allergen, tax, dimensions, marketing, lifespan, party, contact or other source-only data
- **THEN** the system does not add those values to the persisted product
- **AND** `types/product.ts` is not expanded for the import feature

#### Scenario: Imported values are reviewed before persistence
- **WHEN** supported values have been populated from a JSON file
- **THEN** no product update is persisted until the user submits the existing product edit form
