# orders-tab-order-list Specification

## Purpose
TBD - created by archiving change orders-tab-with-order-list. Update Purpose after archive.
## Requirements
### Requirement: User can open orders from a dedicated tab
The system SHALL provide an Orders (`Tilaukset`) tab in primary app navigation so users can access order browsing directly. In the redesigned tab layout, this Orders tab SHALL remain directly visible alongside `Varasto` and `Raportti`.

#### Scenario: Navigate to orders tab
- **WHEN** user selects Orders tab from the main tab bar
- **THEN** system opens the orders list screen

### Requirement: Orders tab shows company order list
The system SHALL fetch and display company orders in the Orders tab list view. Order data SHALL reflect backend-calculated product line pricing, including campaign-code discounted `finalPrice` when applicable. The backend pricing metadata endpoint (`getPrices`) SHALL return `delivery` and `over` (free-delivery threshold) in country-aware currency: EUR by default and SEK for country `SE` via currency `getRate`. Same-day rate cache in company options SHALL be used before external fetch. The order list UI SHALL provide segments for statuses `placed`, `paid`, and `sent`, and show orders oldest first within the active segment.

#### Scenario: Orders are shown in list
- **WHEN** Orders tab loads successfully and orders exist
- **THEN** system displays a list of orders with key row metadata for each order

#### Scenario: Segment filters orders by status
- **WHEN** user selects `placed`, `paid`, or `sent` segment
- **THEN** list shows only orders with matching status

#### Scenario: Segment excludes non-segment statuses
- **WHEN** orders contain statuses outside `placed`, `paid`, `sent`
- **THEN** those orders are not shown in segmented list

#### Scenario: Orders sorted oldest first
- **WHEN** orders are shown in selected segment
- **THEN** list is sorted by created time ascending (oldest first)

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
The system SHALL allow users to open an order details/actions view from an order row tap, and order detail SHALL list ordered products with line `name` and `amount`.

#### Scenario: Tap order row
- **WHEN** user taps an order row in Orders tab
- **THEN** system navigates to the existing order details/actions route for that order

#### Scenario: Order detail shows product lines
- **WHEN** user opens order detail page for an order with product lines
- **THEN** system lists each ordered line item with product `name` and `amount`

#### Scenario: Order detail shows empty product-line state
- **WHEN** user opens order detail page for an order with no product lines
- **THEN** system shows explicit empty-state text for product list section

### Requirement: Sent status update delegates customer notification to backend
The system SHALL treat order sent-status updates from the app as status-only writes, and customer sent-notification enqueue side effects SHALL be handled by backend order update triggers.

#### Scenario: App marks order as sent
- **WHEN** user marks an order as `sent` from order detail flow
- **THEN** client updates order status and does not directly create a `mail` document

#### Scenario: Notification still created after app sent action
- **WHEN** app marks order status to `sent` successfully
- **THEN** backend order update trigger enqueues the sent-notification `mail` document

