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
The system SHALL fetch and display company orders in the Orders tab list view. Order data SHALL reflect backend-calculated product line pricing, including campaign-code discounted `finalPrice` when applicable. The backend pricing metadata endpoint (`getPrices`) SHALL return `delivery` and `over` (free-delivery threshold) in country-aware currency: EUR by default and SEK for country `SE` via currency `getRate`. Same-day rate cache in company options SHALL be used before external fetch.

#### Scenario: Orders are shown in list
- **WHEN** Orders tab loads successfully and orders exist
- **THEN** system displays a list of orders with key row metadata for each order

#### Scenario: Prices response in default currency
- **WHEN** `getPrices` is requested without country `SE`
- **THEN** backend returns `delivery` and `over` in EUR values

#### Scenario: Prices response converted for Sweden using same-day cache
- **WHEN** `getPrices` is requested with country `SE` and options include same-date EUR->SEK cached rate
- **THEN** backend converts `delivery` and `over` using cached rate without external rate fetch

#### Scenario: Prices response converted for Sweden after stale/missing cache
- **WHEN** `getPrices` is requested with country `SE` and options cache is missing or stale
- **THEN** backend fetches rate via `getRate`, saves (`date`, `currency`, `rate`) to options, and converts `delivery` and `over`

#### Scenario: SE conversion rate unavailable
- **WHEN** `getPrices` for country `SE` cannot resolve a valid rate from cache/fetch path
- **THEN** backend returns EUR `delivery` and `over` values without request failure

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

