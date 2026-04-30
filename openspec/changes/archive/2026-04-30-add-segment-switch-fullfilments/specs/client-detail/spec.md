## MODIFIED Requirements

### Requirement: Fullfilment History by Month
The system SHALL display fullfilments grouped by month in chronological order (newest first), showing total amounts and dates for each fullfilment. The system SHALL provide a segment control to toggle between monthly and product-based views.

#### Scenario: Display monthly fullfilment groups
- **WHEN** user views the client detail page and selects "Kuukausittain" tab
- **THEN** system shows a "Täyttymiset kuukausittain" section
- **AND** groups fullfilments by month (format: "MMMM YYYY")
- **AND** displays each fullfilment with date, product name, and amount
- **AND** shows total amount for each month

#### Scenario: Segment control display
- **WHEN** user views the fullfilments section
- **THEN** system displays a segment control with "Kuukausittain" and "Tuotteittain" options
- **AND** "Kuukausittain" is selected by default

#### Scenario: Switch between views
- **WHEN** user taps on a segment control option
- **THEN** system updates the active tab visually
- **AND** displays the corresponding fullfilment view
- **AND** maintains the selection state

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