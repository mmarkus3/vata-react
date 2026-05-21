## MODIFIED Requirements

### Requirement: Retail and unit prices are returned in subsequent product reads
The system SHALL return persisted retail and unit prices in subsequent product read responses. The backend API implementation in `functions/src/products/products.service.ts` SHALL return `lowestRetailPriceLast30Days` for both product list and product detail responses, using the same 30-day lowest-price calculation behavior as the React-side pricing utility. The backend SHALL also return campaign-aware `discountPrice` for active auto-applied campaigns (without code), selecting the lowest valid resulting price per product. The backend SHALL return price fields in company-country currency: EUR by default and converted SEK values for country `SE` using currency `getRate`. Same-day currency rate cache saved in company options SHALL be used before external fetch.

#### Scenario: Re-open product after pricing update
- **WHEN** a product is fetched after retail/unit price values are saved
- **THEN** the fetched product includes the saved retail and unit price values

#### Scenario: Backend product responses include lowest retail price for previous 30 days
- **WHEN** backend product list or detail endpoints return a product with current/historical retail price data
- **THEN** response includes `lowestRetailPriceLast30Days` computed from current retail price and dated history entries in the previous 30 days

#### Scenario: Backend product responses include null fallback when not computable
- **WHEN** backend product list or detail endpoints return a product without valid current/historical candidates
- **THEN** response still includes `lowestRetailPriceLast30Days`
- **AND** its value is `null`

#### Scenario: Company country is not SE
- **WHEN** backend product responses are generated for company with non-SE country or missing country
- **THEN** price fields are returned in EUR values without currency conversion

#### Scenario: Company country is SE with same-day cached rate
- **WHEN** backend product responses are generated for company country `SE` and options contain same-date EUR->SEK rate cache
- **THEN** backend uses cached rate without external `getRate` call

#### Scenario: Company country is SE with stale or missing rate cache
- **WHEN** backend product responses are generated for company country `SE` and options cache is missing or date differs from current date
- **THEN** backend fetches rate via `getRate`, saves cache to options (`date`, `currency`, `rate`), and uses fetched rate

#### Scenario: Currency rate unavailable
- **WHEN** backend cannot resolve a valid EUR->SEK rate from cache/fetch path
- **THEN** backend falls back to EUR values without failing the product response
