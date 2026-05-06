## MODIFIED Requirements

### Requirement: Fullfilment Creation Modal
The system SHALL provide a modal form for creating new fullfilments with date selection, product selection, amount inputs, and editable line-item price.

#### Scenario: Open fullfilment creation modal
- **WHEN** user taps the "Lisää täyttö" button
- **THEN** system opens a modal overlay with fullfilment creation form
- **AND** modal has a title "Lisää täyttö"
- **AND** modal can be dismissed by tapping outside or using a close button

#### Scenario: Fullfilment form fields
- **WHEN** fullfilment creation modal is open
- **THEN** system displays a date picker field
- **AND** displays a product selection dropdown
- **AND** displays an amount input field
- **AND** displays a price input field prefilled from selected product price
- **AND** displays "Lisää tuote" and "Tallenna" buttons

#### Scenario: Add multiple products
- **WHEN** user selects a product, enters amount, optionally edits price, and taps "Lisää tuote"
- **THEN** system adds the product with amount and chosen price to a list in the modal
- **AND** clears transient entry fields for next line
- **AND** displays the added products with remove options

#### Scenario: Remove product from list
- **WHEN** user taps remove button next to a product in the list
- **THEN** system removes that product from the fullfilment
- **AND** updates the product list display

### Requirement: Fullfilment Creation Validation
The system SHALL validate fullfilment creation inputs and provide appropriate error messages.

#### Scenario: Validate required fields
- **WHEN** user attempts to save fullfilment without date
- **THEN** system displays an error message

#### Scenario: Validate product selection
- **WHEN** user attempts to add product without selecting one
- **THEN** system displays an error message

#### Scenario: Validate amount input
- **WHEN** user enters invalid amount (negative, zero, or non-numeric)
- **THEN** system displays an error message

#### Scenario: Validate price input
- **WHEN** user enters invalid price (negative, empty, or non-numeric)
- **THEN** system displays an error message

#### Scenario: Validate at least one product
- **WHEN** user attempts to save fullfilment with no products added
- **THEN** system displays an error message
