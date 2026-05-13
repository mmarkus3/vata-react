## ADDED Requirements

### Requirement: Product forms provide a dedicated additional info accordion section
The system SHALL provide an `additionalInfo` accordion section in both product create and product detail edit forms to group multilingual ingredients and multilingual descriptions.

#### Scenario: Create form shows additional info section
- **WHEN** a user opens the product create modal
- **THEN** the form presents an `additionalInfo` accordion section labeled for additional product information
- **AND** the section contains `ingredients_fi`, `ingredients_sv`, `ingredients_en`, `description_fi`, `description_sv`, and `description_en` inputs

#### Scenario: Product detail edit shows additional info section
- **WHEN** a user enters edit mode on product detail
- **THEN** the form presents an `additionalInfo` accordion section labeled for additional product information
- **AND** the section contains `ingredients_fi`, `ingredients_sv`, `ingredients_en`, `description_fi`, `description_sv`, and `description_en` inputs

#### Scenario: Additional info fields are excluded from basic section
- **WHEN** a user views product create or product detail edit form sections
- **THEN** ingredients and description language fields are not rendered inside the `basic` accordion section
