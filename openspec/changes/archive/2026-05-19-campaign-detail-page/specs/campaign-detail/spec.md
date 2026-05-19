## ADDED Requirements

### Requirement: User can open campaign detail page
The system SHALL allow users to open a dedicated campaign detail page from campaigns listing.

#### Scenario: Open campaign details from list
- **WHEN** user taps a campaign row in campaigns list
- **THEN** system navigates to campaign detail page for that campaign

### Requirement: Campaign detail shows key campaign metadata
The system SHALL display key campaign data on detail page.

#### Scenario: Campaign detail metadata rendered
- **WHEN** campaign detail loads successfully
- **THEN** system shows campaign name, mode, discount type/value, and validity period

### Requirement: Campaign detail shows targeting information
The system SHALL display campaign targeting mode and relevant targeting data.

#### Scenario: Selected-products targeting
- **WHEN** campaign targeting mode is selected-products
- **THEN** detail page shows selected product list for campaign

#### Scenario: Category targeting
- **WHEN** campaign targeting mode is category
- **THEN** detail page shows selected category reference/label

#### Scenario: All-products targeting
- **WHEN** campaign targeting mode is all-products
- **THEN** detail page indicates campaign applies to all products

### Requirement: Campaign detail handles loading and error states
The system SHALL render clear loading and error states while fetching campaign detail.

#### Scenario: Campaign detail loading
- **WHEN** campaign detail fetch is in progress
- **THEN** system shows loading state

#### Scenario: Campaign detail fetch fails
- **WHEN** campaign detail fetch fails
- **THEN** system shows error state message
