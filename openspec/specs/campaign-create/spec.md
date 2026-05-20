# campaign-create Specification

## Purpose
TBD - created by archiving change campaign-fixed-price-per-product. Update Purpose after archive.
## Requirements
### Requirement: User can create campaign scoped to own company
The system SHALL allow authenticated users to create campaigns, and each campaign SHALL be assigned to the company from the user's profile.

#### Scenario: Create campaign with profile company
- **WHEN** user saves a valid campaign
- **THEN** system stores campaign with `company` equal to `user.profile.company`

### Requirement: Campaign supports code-based and auto-applied modes
The system SHALL support campaigns with optional code where mode is determined by code presence.

#### Scenario: Campaign with code applies at checkout
- **WHEN** campaign has a non-empty code
- **THEN** campaign is marked for checkout-code application in webshop

#### Scenario: Campaign without code applies directly to targeted products
- **WHEN** campaign code is empty or missing
- **THEN** campaign is marked as auto-applied for targeted products

### Requirement: Campaign has valid start and end time
The system SHALL require campaign start and end time and SHALL validate that end time is later than start time.

#### Scenario: Valid campaign period
- **WHEN** user enters start and end where end is after start
- **THEN** system allows saving campaign

#### Scenario: Invalid campaign period
- **WHEN** user enters end time equal to or before start
- **THEN** system blocks save and shows validation error

#### Scenario: Date selection uses datepicker
- **WHEN** user sets campaign start or end date in create flow
- **THEN** system provides datepicker controls instead of free-text date inputs

### Requirement: Campaign supports targeting scope selection
The system SHALL allow user to target campaign products by one of: selected products, all products, or all products in a selected category.

#### Scenario: Target selected products with shared product picker
- **WHEN** user chooses selected-products mode and opens product picker
- **THEN** system uses shared `SelectProduct` component flow to select one or more products

#### Scenario: Target all products
- **WHEN** user chooses all-products mode
- **THEN** campaign stores all-products targeting mode without requiring per-product selection

#### Scenario: Target category products
- **WHEN** user chooses category mode and selects category
- **THEN** campaign stores category targeting mode and selected category reference

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
