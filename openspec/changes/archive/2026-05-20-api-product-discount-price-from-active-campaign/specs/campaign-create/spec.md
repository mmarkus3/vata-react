## MODIFIED Requirements

### Requirement: Campaign supports percentage and fixed-price discount types
The system SHALL allow user to choose discount type as percentage from retail price or fixed price.

#### Scenario: Percentage discount campaign
- **WHEN** user selects percentage type and enters valid percentage value
- **THEN** campaign stores percentage discount configuration that backend interprets against product `retailPrice` for effective `discountPrice` calculation

#### Scenario: Fixed-price discount campaign with per-product values
- **WHEN** user selects fixed-price type with selected-products targeting
- **THEN** system requires and stores fixed price value for each selected product line

#### Scenario: Apply same fixed price to all targeted products
- **WHEN** user enters one fixed price in the shared bulk input and applies it
- **THEN** system populates fixed price for every currently targeted product line with that value

#### Scenario: Per-product override after bulk apply
- **WHEN** user updates one product line value after bulk apply
- **THEN** system keeps the overridden line value and does not reset it unless user applies bulk value again

#### Scenario: Invalid fixed-price per-product value
- **WHEN** any selected product fixed price is missing or invalid
- **THEN** system blocks save and shows validation error

#### Scenario: Invalid discount value
- **WHEN** discount value is missing, zero, or invalid for selected discount type
- **THEN** system blocks save and shows validation error
