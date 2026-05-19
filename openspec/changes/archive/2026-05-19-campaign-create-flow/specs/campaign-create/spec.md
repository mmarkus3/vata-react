## ADDED Requirements

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

### Requirement: Campaign supports targeting scope selection
The system SHALL allow user to target campaign products by one of: selected products, all products, or all products in a selected category.

#### Scenario: Target selected products
- **WHEN** user chooses selected-products mode and chooses one or more products
- **THEN** campaign stores selected product references

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
- **THEN** campaign stores percentage discount configuration

#### Scenario: Fixed-price discount campaign
- **WHEN** user selects fixed-price type and enters valid fixed price
- **THEN** campaign stores fixed-price discount configuration

#### Scenario: Invalid discount value
- **WHEN** discount value is missing, zero, or invalid for selected discount type
- **THEN** system blocks save and shows validation error
