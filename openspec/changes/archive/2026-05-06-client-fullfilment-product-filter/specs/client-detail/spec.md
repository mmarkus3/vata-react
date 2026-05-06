## MODIFIED Requirements

### Requirement: Product Data Loading
The system SHALL load product data for fullfilment creation modal and support source-based filtering with a default source of products already used for the selected client.

#### Scenario: Load products on modal open
- **WHEN** fullfilment creation modal opens
- **THEN** system fetches products for the current company
- **AND** displays products in dropdown with format "Name (EAN)"

#### Scenario: Handle product loading errors
- **WHEN** product data cannot be loaded
- **THEN** system displays error message in modal "Tuotteiden lataus epäonnistui"
- **AND** disables product selection until retry

#### Scenario: Default source uses client fullfilment products
- **WHEN** modal opens and data loads successfully
- **THEN** source `Kaupan tuotteet` is selected by default
- **AND** product options include only products found in the selected client's historical fullfilments

#### Scenario: Switch source to all products
- **WHEN** user changes source to `Kaikki tuotteet`
- **THEN** modal updates product options to all company products
- **AND** selected source state remains visible to user

#### Scenario: No products in default source
- **WHEN** selected client has no historical fullfilment products
- **THEN** system shows empty state for `Kaupan tuotteet`
- **AND** user can switch to `Kaikki tuotteet` to continue product selection
