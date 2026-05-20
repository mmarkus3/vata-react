## MODIFIED Requirements

### Requirement: Place order validates product and stock availability
The system SHALL validate each ordered product exists and requested amounts are available before order placement. If a discount code is provided, the backend SHALL fetch matching campaign from Firestore, validate campaign applicability, and calculate discounted line `finalPrice` for applicable products.

#### Scenario: Product does not exist
- **WHEN** place order includes unknown product ID
- **THEN** backend rejects order with validation error

#### Scenario: Product stock insufficient
- **WHEN** place order requests amount greater than available stock
- **THEN** backend rejects order with validation error

#### Scenario: Valid campaign code with percentage discount
- **WHEN** order includes valid active campaign code and campaign line has percentage discount for product
- **THEN** backend sets product `finalPrice` using percentage discount calculation from the order pricing base value

#### Scenario: Valid campaign code with fixed discount
- **WHEN** order includes valid active campaign code and campaign line has fixed discount for product
- **THEN** backend sets product `finalPrice` to campaign line fixed value

#### Scenario: Campaign code invalid or inactive
- **WHEN** order includes campaign code that is missing, expired, not yet active, or otherwise invalid
- **THEN** backend does not apply campaign discount pricing and follows existing invalid-code handling policy

#### Scenario: Product not part of campaign
- **WHEN** campaign is valid but product is not listed in campaign products
- **THEN** backend keeps product non-discounted `finalPrice`
