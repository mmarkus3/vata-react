## ADDED Requirements

### Requirement: Product visibility in webshop is controlled by showInWebshop
The system SHALL expose a `showInWebshop` product property that controls whether a product is eligible to be shown in the webshop, and the property SHALL be stored and read as a boolean value.

#### Scenario: New product defaults to visible in webshop
- **WHEN** a user creates a new product without changing webshop visibility
- **THEN** the created product is persisted with `showInWebshop = false`

#### Scenario: User disables webshop visibility
- **WHEN** a user sets webshop visibility off and saves product changes
- **THEN** the persisted product has `showInWebshop = false`

#### Scenario: Legacy product without field is read safely
- **WHEN** the system reads a product document that does not contain `showInWebshop`
- **THEN** the runtime product model treats the value as `false`

#### Scenario: Firestore writes never send undefined for visibility
- **WHEN** the system builds create or update payloads for products
- **THEN** the payload includes a concrete boolean for `showInWebshop`
- **AND** never includes `showInWebshop` as `undefined`
