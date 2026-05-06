## MODIFIED Requirements

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

### Requirement: Loading and Error States
The system SHALL handle loading states and errors appropriately during data fetching and fullfilment edit operations.

#### Scenario: Loading client data
- **WHEN** user navigates to client detail page
- **THEN** system shows a loading indicator while fetching client and fullfilment data

#### Scenario: Handle fullfilment edit errors
- **WHEN** fullfilment edit save fails
- **THEN** system displays an error message
- **AND** keeps edit interface open with current user input
