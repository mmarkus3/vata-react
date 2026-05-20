## MODIFIED Requirements

### Requirement: Product API returns campaign-aware effective discount price
The system SHALL return `discountPrice` in product API responses when one or more active auto-applied campaigns (without code) apply to the product.

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
