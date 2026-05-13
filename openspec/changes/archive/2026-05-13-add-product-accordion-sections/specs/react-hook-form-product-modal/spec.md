## MODIFIED Requirements

### Requirement: Product create modal uses declarative form state and validation
The system SHALL manage `AddProductModal` form fields, including optional category selection, through a declarative form model that centralizes field values, validation rules, submit handling, and accordion-grouped field presentation.

#### Scenario: Required product fields block submission when empty
- **WHEN** a user attempts to submit the product create modal without a product name, amount, or price
- **THEN** the system rejects submission and shows field-specific validation errors for each missing required field

#### Scenario: Numeric fields reject invalid or negative values
- **WHEN** a user provides a non-numeric or negative value in numeric form fields that require non-negative numbers
- **THEN** the system rejects submission and presents a localized validation error for each invalid field

#### Scenario: Valid input submits with existing create-product workflow
- **WHEN** a user submits the modal with valid required fields and optional valid numeric fields
- **THEN** the system invokes the product creation workflow with parsed values and preserves existing post-submit behavior (loading state, success callbacks, and reset)

#### Scenario: Create submission includes selected category
- **WHEN** a user selects a category option in product create form and saves successfully
- **THEN** the create payload includes the selected category value

#### Scenario: Accordion layout preserves form behavior
- **WHEN** a user expands or collapses `basic`, `price`, or `nutritions` sections while editing values
- **THEN** entered values and validation behavior remain intact
