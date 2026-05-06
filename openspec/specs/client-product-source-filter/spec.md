# client-product-source-filter Specification

## Purpose
TBD - created by archiving change client-fullfilment-product-filter. Update Purpose after archive.
## Requirements
### Requirement: Fullfilment modal SHALL support product source filtering
The system SHALL allow users to choose product source in fullfilment creation modal between products already used in the selected client's fullfilments and all company products.

#### Scenario: Show product source options
- **WHEN** user opens the add fullfilment modal
- **THEN** system shows product source options `Kaupan tuotteet` and `Kaikki tuotteet`

### Requirement: Default source SHALL be client fullfilment products
The system MUST default the product source to client fullfilment products.

#### Scenario: Default filtered source on modal open
- **WHEN** add fullfilment modal opens
- **THEN** `Kaupan tuotteet` is selected by default
- **AND** product list contains only products already present in that client's historical fullfilments

### Requirement: User SHALL be able to switch to all products
The system SHALL allow switching product source to all company products without closing the modal.

#### Scenario: Switch source to all products
- **WHEN** user selects `Kaikki tuotteet`
- **THEN** product list updates to include all company products
- **AND** user can continue fullfilment creation in the same modal session

