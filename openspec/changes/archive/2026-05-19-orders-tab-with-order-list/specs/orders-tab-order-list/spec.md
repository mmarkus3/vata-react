## ADDED Requirements

### Requirement: User can open orders from a dedicated tab
The system SHALL provide an Orders tab in primary app navigation so users can access order browsing directly.

#### Scenario: Navigate to orders tab
- **WHEN** user selects Orders tab from the main tab bar
- **THEN** system opens the orders list screen

### Requirement: Orders tab shows company order list
The system SHALL fetch and display company orders in the Orders tab list view.

#### Scenario: Orders are shown in list
- **WHEN** Orders tab loads successfully and orders exist
- **THEN** system displays a list of orders with key row metadata for each order

### Requirement: Orders tab handles loading, empty, and error states
The system SHALL render clear list states during order fetch lifecycle.

#### Scenario: Loading orders
- **WHEN** orders are being fetched
- **THEN** system shows loading state in Orders tab

#### Scenario: No orders available
- **WHEN** orders fetch succeeds and returns zero items
- **THEN** system shows empty state message in Orders tab

#### Scenario: Orders fetch fails
- **WHEN** orders fetch fails
- **THEN** system shows error state message in Orders tab

### Requirement: User can open order flow from order list row
The system SHALL allow users to open an order details/actions view from an order row tap.

#### Scenario: Tap order row
- **WHEN** user taps an order row in Orders tab
- **THEN** system navigates to the existing order details/actions route for that order
