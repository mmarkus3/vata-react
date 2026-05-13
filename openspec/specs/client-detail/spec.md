# client-detail Specification

## Purpose
TBD - created by archiving change create-client-page. Update Purpose after archive.
## Requirements
### Requirement: Client Detail Page Navigation
The system SHALL provide a client detail page accessible via the route `/client/[id]` where `[id]` is the client's unique identifier. The page SHALL include actions to create, edit, and delete the client.

#### Scenario: Navigate to client detail from client list
- **WHEN** user taps on a client item in the clients list
- **THEN** system navigates to the client detail page for that client
- **AND** the page URL reflects the client ID (`/client/{clientId}`)

#### Scenario: Display client management actions
- **WHEN** user views the client detail page
- **THEN** system displays actions to edit and delete the client
- **AND** destructive delete action is visually distinct from non-destructive actions

### Requirement: Client Information Display
The system SHALL display comprehensive client information including name, company, contact details, and address in a clear, readable format.

#### Scenario: Display client information
- **WHEN** user navigates to a client detail page
- **THEN** system displays the client's name as the page title
- **AND** displays company name, contact person, phone, email, and address in organized sections
- **AND** handles missing information gracefully (shows "Ei tiedossa" for empty fields)

### Requirement: Fullfilment History by Month
The system SHALL display fullfilments grouped by month in chronological order and support opening a selected fullfilment from the monthly list for editing.

#### Scenario: Display monthly fullfilment groups
- **WHEN** user views the client detail page and selects "Kuukausittain" tab
- **THEN** system shows fullfilments grouped by month
- **AND** displays each fullfilment with date, product names, and amount totals

#### Scenario: Open fullfilment from monthly list
- **WHEN** user taps a fullfilment row in monthly list
- **THEN** system opens edit interface for that fullfilment
- **AND** preloads current fullfilment data into editable fields

#### Scenario: Refresh list after successful edit
- **WHEN** user saves valid fullfilment edits
- **THEN** system closes edit interface
- **AND** refreshes monthly and product-grouped fullfilment data

### Requirement: Fullfilment History by Product and Month
The system SHALL display fullfilments grouped first by product, then by month within each product, showing cumulative amounts. The system SHALL provide a segment control to toggle between monthly and product-based views.

#### Scenario: Display product-grouped fullfilments
- **WHEN** user views the client detail page and selects "Tuotteittain" tab
- **THEN** system shows a "Täyttymiset tuotteittain" section
- **AND** groups fullfilments by product name
- **AND** within each product, groups by month
- **AND** displays cumulative amounts for each product-month combination

#### Scenario: Segment control display
- **WHEN** user views the fullfilments section
- **THEN** system displays a segment control with "Kuukausittain" and "Tuotteittain" options
- **AND** "Kuukausittain" is selected by default

#### Scenario: Switch between views
- **WHEN** user taps on a segment control option
- **THEN** system updates the active tab visually
- **AND** displays the corresponding fullfilment view
- **AND** maintains the selection state

### Requirement: Loading and Error States
The system SHALL handle loading states and errors appropriately during data fetching and fullfilment edit operations.

#### Scenario: Loading client data
- **WHEN** user navigates to client detail page
- **THEN** system shows a loading indicator while fetching client and fullfilment data

#### Scenario: Handle fullfilment edit errors
- **WHEN** fullfilment edit save fails
- **THEN** system displays an error message
- **AND** keeps edit interface open with current user input

### Requirement: Responsive Design
The system SHALL ensure the client detail page is usable on mobile devices with appropriate spacing and typography.

#### Scenario: Mobile layout
- **WHEN** viewed on mobile devices
- **THEN** content uses full width with appropriate padding
- **AND** sections are clearly separated with visual hierarchy
- **AND** text is readable at standard mobile font sizes

### Requirement: Client Detail Page Navigation
The system SHALL provide a client detail page accessible via the route `/client/[id]` where `[id]` is the client's unique identifier. The page SHALL include actions to create, edit, and delete the client.

#### Scenario: Navigate to client detail from client list
- **WHEN** user taps on a client item in the clients list
- **THEN** system navigates to the client detail page for that client
- **AND** the page URL reflects the client ID (`/client/{clientId}`)

#### Scenario: Display client management actions
- **WHEN** user views the client detail page
- **THEN** system displays actions to edit and delete the client
- **AND** destructive delete action is visually distinct from non-destructive actions

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

### Requirement: Fullfilment Creation Submission
The system SHALL create the fullfilment in the database, decrement product inventory for included products, and refresh the client detail page.

#### Scenario: Successful fullfilment creation
- **WHEN** user fills valid fullfilment data and taps "Tallenna"
- **THEN** system creates the fullfilment in Firestore with client reference
- **AND** decrements each selected product amount in storage
- **AND** closes the modal
- **AND** refreshes the fullfilment list on the client detail page

#### Scenario: Handle creation errors
- **WHEN** fullfilment creation fails due to network or database errors
- **THEN** system displays an error message
- **AND** keeps the modal open with form data intact
- **AND** allows user to retry submission

#### Scenario: Handle insufficient inventory
- **WHEN** fullfilment creation fails because one or more selected products have insufficient stock
- **THEN** system displays an error message indicating insufficient stock
- **AND** keeps the modal open with form data intact
- **AND** does not create the fullfilment

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

### Requirement: Loading States During Creation
The system SHALL show appropriate loading states during fullfilment creation and product loading.

#### Scenario: Show loading during product fetch
- **WHEN** modal opens and products are being fetched
- **THEN** system shows loading indicator in product dropdown
- **AND** disables form interaction until products are loaded

#### Scenario: Show loading during save
- **WHEN** user taps "Tallenna" and creation is in progress
- **THEN** system shows loading indicator on save button
- **AND** disables all form inputs and buttons
- **AND** prevents modal dismissal during save

