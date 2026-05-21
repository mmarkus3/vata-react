## MODIFIED Requirements

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
