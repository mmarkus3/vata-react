## MODIFIED Requirements

### Requirement: Retail and unit prices are returned in subsequent product reads
The system SHALL return persisted retail and unit prices in subsequent product read responses. The backend API implementation in `functions/src/products/products.service.ts` SHALL return `lowestRetailPriceLast30Days` for both product list and product detail responses, using the same 30-day lowest-price calculation behavior as the React-side pricing utility. The backend SHALL also return campaign-aware `discountPrice` for active auto-applied campaigns (without code), selecting the lowest valid resulting price per product. The backend SHALL return price fields in company-country currency: EUR by default and converted SEK values for country `SE` using currency `getRate`.

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

#### Scenario: No applicable auto campaign
- **WHEN** product has no active campaign without code that includes the product
- **THEN** API response does not include a campaign-derived `discountPrice`

#### Scenario: Single fixed-price auto campaign applies
- **WHEN** one active no-code fixed-price campaign includes the product
- **THEN** API returns `discountPrice` equal to that campaign line fixed price

#### Scenario: Single percentage auto campaign applies
- **WHEN** one active no-code percentage campaign includes the product
- **THEN** API returns `discountPrice` calculated from product `retailPrice` and campaign percentage

#### Scenario: Multiple auto campaigns apply
- **WHEN** multiple active no-code campaigns include the same product
- **THEN** API returns the lowest resulting `discountPrice` across all valid campaign candidates

#### Scenario: Campaign is outside active time window
- **WHEN** campaign start/end does not include current time
- **THEN** campaign is ignored for `discountPrice` calculation

#### Scenario: Company country is not SE
- **WHEN** backend product responses are generated for company with non-SE country or missing country
- **THEN** price fields are returned in EUR values without currency conversion

#### Scenario: Company country is SE
- **WHEN** backend product responses are generated for company country `SE`
- **THEN** backend converts exposed product price fields from EUR to SEK using currency `getRate`

#### Scenario: Currency rate unavailable
- **WHEN** backend cannot resolve EUR->SEK rate for company country `SE`
- **THEN** backend falls back to EUR values without failing the product response
