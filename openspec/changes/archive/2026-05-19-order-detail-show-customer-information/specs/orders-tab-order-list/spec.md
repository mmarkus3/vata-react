## MODIFIED Requirements

### Requirement: User can open orders from a dedicated tab
The system SHALL provide an Orders (`Tilaukset`) tab in primary app navigation so users can access order browsing directly. In the redesigned tab layout, this Orders tab SHALL remain directly visible alongside `Varasto` and `Raportti`.

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
The system SHALL allow users to open an order details/actions view from an order row tap, and order detail SHALL list ordered products with line `name` and `amount` and SHALL display customer information.

#### Scenario: Tap order row
- **WHEN** user taps an order row in Orders tab
- **THEN** system navigates to the existing order details/actions route for that order

#### Scenario: Order detail shows product lines
- **WHEN** user opens order detail page for an order with product lines
- **THEN** system lists each ordered line item with product `name` and `amount`

#### Scenario: Order detail shows empty product-line state
- **WHEN** user opens order detail page for an order with no product lines
- **THEN** system shows explicit empty-state text for product list section

#### Scenario: Order detail shows customer information
- **WHEN** user opens order detail page for an order that has customer data
- **THEN** system displays customer information fields (name, email, and address data)

#### Scenario: Order detail shows customer fallback state
- **WHEN** user opens order detail page for an order without customer data
- **THEN** system shows explicit empty/fallback text for customer information section
