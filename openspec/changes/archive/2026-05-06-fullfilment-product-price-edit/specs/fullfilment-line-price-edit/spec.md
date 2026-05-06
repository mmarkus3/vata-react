## ADDED Requirements

### Requirement: Fullfilment modal SHALL display selected product price
The system SHALL display the selected product's current price in the add fullfilment flow.

#### Scenario: Show default product price on selection
- **WHEN** user selects a product in add fullfilment modal
- **THEN** system shows that product's current price as default line price value

### Requirement: User SHALL be able to edit line-item price before adding
The system SHALL allow user to edit the line-item price before adding a product to fullfilment product list.

#### Scenario: Edit line-item price
- **WHEN** user updates the price input and taps "Lisää tuote"
- **THEN** system adds the product line with edited price value

### Requirement: Line-item price MUST be validated
The system MUST reject invalid line prices and show an error message.

#### Scenario: Reject invalid line price
- **WHEN** user enters empty, non-numeric, or negative price
- **THEN** system prevents adding the line
- **AND** displays validation error for price input
