# client-detail Specification

## Purpose
TBD - created by archiving change create-client-page. Update Purpose after archive.
## Requirements
### Requirement: Client Detail Page Navigation
The system SHALL provide a client detail page accessible via the route `/client/[id]` where `[id]` is the client's unique identifier.

#### Scenario: Navigate to client detail from client list
- **WHEN** user taps on a client item in the clients list
- **THEN** system navigates to the client detail page for that client
- **AND** the page URL reflects the client ID (`/client/{clientId}`)

### Requirement: Client Information Display
The system SHALL display comprehensive client information including name, company, contact details, and address in a clear, readable format.

#### Scenario: Display client information
- **WHEN** user navigates to a client detail page
- **THEN** system displays the client's name as the page title
- **AND** displays company name, contact person, phone, email, and address in organized sections
- **AND** handles missing information gracefully (shows "Ei tiedossa" for empty fields)

### Requirement: Fullfilment History by Month
The system SHALL display fullfilments grouped by month in chronological order (newest first), showing total amounts and dates for each fullfilment.

#### Scenario: Display monthly fullfilment groups
- **WHEN** user views the client detail page
- **THEN** system shows a "Täyttymiset kuukausittain" section
- **AND** groups fullfilments by month (format: "MMMM YYYY")
- **AND** displays each fullfilment with date, product name, and amount
- **AND** shows total amount for each month

### Requirement: Fullfilment History by Product and Month
The system SHALL display fullfilments grouped first by product, then by month within each product, showing cumulative amounts.

#### Scenario: Display product-grouped fullfilments
- **WHEN** user views the client detail page
- **THEN** system shows a "Täyttymiset tuotteittain" section
- **AND** groups fullfilments by product name
- **AND** within each product, groups by month
- **AND** displays cumulative amounts for each product-month combination

### Requirement: Loading and Error States
The system SHALL handle loading states and errors appropriately during data fetching.

#### Scenario: Loading client data
- **WHEN** user navigates to client detail page
- **THEN** system shows a loading indicator while fetching client data
- **AND** shows a loading indicator while fetching fullfilment data

#### Scenario: Handle missing client
- **WHEN** client with the specified ID does not exist
- **THEN** system displays an error message "Asiakasta ei löytynyt"
- **AND** provides a way to navigate back to the clients list

#### Scenario: Handle fullfilment fetch errors
- **WHEN** fullfilment data cannot be fetched
- **THEN** system displays an error message for the fullfilment sections
- **AND** still displays client information if available

### Requirement: Responsive Design
The system SHALL ensure the client detail page is usable on mobile devices with appropriate spacing and typography.

#### Scenario: Mobile layout
- **WHEN** viewed on mobile devices
- **THEN** content uses full width with appropriate padding
- **AND** sections are clearly separated with visual hierarchy
- **AND** text is readable at standard mobile font sizes

