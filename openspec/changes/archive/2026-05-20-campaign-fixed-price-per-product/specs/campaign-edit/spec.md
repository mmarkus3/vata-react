## MODIFIED Requirements

### Requirement: User can edit campaign from detail page
The system SHALL allow users to edit an existing campaign directly from campaign detail page.

#### Scenario: Open edit modal from detail
- **WHEN** user is on campaign detail page and taps edit action
- **THEN** system opens dedicated campaign edit modal

### Requirement: Edit modal is prefilled with campaign values
The system SHALL prefill edit modal fields from the selected campaign data.

#### Scenario: Prefilled campaign fields
- **WHEN** edit modal opens
- **THEN** name, code, dates, targeting, and discount fields show current campaign values

#### Scenario: Prefilled per-product fixed prices
- **WHEN** campaign is fixed-price with selected products
- **THEN** edit modal prepopulates fixed price per selected product line

### Requirement: User can save valid campaign edits
The system SHALL persist campaign updates when edit form passes validation.

#### Scenario: Successful campaign update
- **WHEN** user edits campaign with valid values and saves
- **THEN** system updates campaign by ID and closes modal

#### Scenario: Invalid campaign update blocked
- **WHEN** user edits campaign with invalid values
- **THEN** system shows validation error and does not persist updates

#### Scenario: Invalid per-product fixed prices blocked
- **WHEN** campaign fixed-price mode has missing or invalid per-product fixed values
- **THEN** system blocks save and shows validation error

### Requirement: Campaign detail reflects saved edits
The system SHALL show updated campaign data after successful edit save.

#### Scenario: Detail refresh after save
- **WHEN** campaign update succeeds
- **THEN** detail page displays latest saved campaign values
