## MODIFIED Requirements

### Requirement: Orders tab shows company order list
The system SHALL fetch and display company orders in the Orders tab list view. Order data SHALL reflect backend-calculated product line pricing, including campaign-code discounted `finalPrice` when applicable. The backend pricing metadata endpoint (`getPrices`) SHALL return `delivery` and `over` (free-delivery threshold) in country-aware currency: EUR by default and SEK for country `SE` via currency `getRate`. The UI SHALL display order country in list and detail views only when country is present and not default `FI`.

#### Scenario: Orders are shown in list
- **WHEN** Orders tab loads successfully and orders exist
- **THEN** system displays a list of orders with key row metadata for each order

#### Scenario: Order has campaign code discounted lines
- **WHEN** backend placed order with valid campaign code discounts
- **THEN** returned order data contains product lines with discounted `finalPrice` values

#### Scenario: Prices response in default currency
- **WHEN** `getPrices` is requested without country `SE`
- **THEN** backend returns `delivery` and `over` in EUR values

#### Scenario: Prices response converted for Sweden
- **WHEN** `getPrices` is requested with country `SE`
- **THEN** backend converts `delivery` and `over` from EUR to SEK using `getRate`

#### Scenario: SE conversion rate unavailable
- **WHEN** `getPrices` for country `SE` cannot fetch a valid EUR->SEK rate
- **THEN** backend returns EUR `delivery` and `over` values without request failure

#### Scenario: List displays non-default country
- **WHEN** an order in list has country value other than `FI`
- **THEN** order row shows that country to user

#### Scenario: List hides default country
- **WHEN** an order in list has country `FI` or missing country
- **THEN** order row does not show country field

#### Scenario: Detail displays non-default country
- **WHEN** user opens order detail for order with country other than `FI`
- **THEN** detail view shows order country

#### Scenario: Detail hides default country
- **WHEN** user opens order detail for order with country `FI` or missing country
- **THEN** detail view does not show country field
