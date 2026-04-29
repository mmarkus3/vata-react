## ADDED Requirements

### Requirement: Product Detail Navigation
The system SHALL allow users to navigate to a product detail page by tapping on a product in the storage list.

#### Scenario: Navigate to product detail
- **WHEN** user taps on a product in the storage list
- **THEN** system navigates to the product detail page showing full product information

### Requirement: Product Information Display
The system SHALL display comprehensive product information including name, amount, price, EAN, barcode text, and barcode image on the product detail page.

#### Scenario: Display product details
- **WHEN** user views the product detail page
- **THEN** system shows all product fields with appropriate formatting
- **AND** barcode image is displayed if available

### Requirement: Product Editing
The system SHALL allow users to edit product information (name, price, barcode, EAN) from the product detail page.

#### Scenario: Edit product information
- **WHEN** user modifies product fields and saves changes
- **THEN** system updates the product in Firestore
- **AND** refreshes the display with updated information

### Requirement: Amount Reset
The system SHALL allow users to reset the product amount to a new value from the product detail page.

#### Scenario: Reset product amount
- **WHEN** user enters a new amount and confirms the change
- **THEN** system updates the product amount in Firestore
- **AND** displays the updated amount

### Requirement: Product Deletion
The system SHALL allow users to delete products from the product detail page with confirmation.

#### Scenario: Delete product
- **WHEN** user initiates product deletion and confirms
- **THEN** system removes the product from Firestore
- **AND** navigates back to the storage list
- **AND** shows a success message