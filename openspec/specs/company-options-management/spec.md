# company-options-management Specification

## Purpose
TBD - created by archiving change company-options-editing. Update Purpose after archive.
## Requirements
### Requirement: Company options page is available from menu
The system SHALL provide a company options page accessible from the overflow menu for signed-in users with a company profile.

#### Scenario: Options menu item opens page
- **WHEN** a signed-in user opens the overflow menu
- **THEN** the system shows an options menu item
- **AND** selecting it navigates to the company options page

#### Scenario: Missing company profile
- **WHEN** a user without a company profile opens the company options page
- **THEN** the system shows a localized message that company options cannot be loaded

### Requirement: Company options can be viewed
The system SHALL load the signed-in user's company options from `options/{companyId}` and display editable option fields.

#### Scenario: Existing options loaded
- **WHEN** the company options document exists
- **THEN** the system displays the editable option fields with their current values

#### Scenario: Options loading state
- **WHEN** company options are being fetched
- **THEN** the system shows a loading state

#### Scenario: Options load fails
- **WHEN** fetching company options fails
- **THEN** the system shows a localized error state

### Requirement: Company options can be edited
The system SHALL allow users to update editable company option fields and save them to Firestore.

#### Scenario: Valid options saved
- **WHEN** the user edits valid option values and saves
- **THEN** the system writes the editable values to `options/{companyId}`
- **AND** the system shows localized save feedback

#### Scenario: Invalid numeric value rejected
- **WHEN** the user enters an invalid numeric value for a numeric option
- **THEN** the system prevents saving
- **AND** the system shows a localized validation error

#### Scenario: Undefined values are not sent
- **WHEN** the system saves company options
- **THEN** the Firestore payload excludes fields with `undefined` values

### Requirement: Currency rate cache is hidden and preserved
The system SHALL keep `currencyRate` system-managed by excluding it from the options form and preserving existing Firestore data on save.

#### Scenario: Currency rate not displayed
- **WHEN** the company options page displays option fields
- **THEN** the system does not show a `currencyRate` field

#### Scenario: Currency rate preserved on save
- **WHEN** the user saves edited company options and the existing document contains `currencyRate`
- **THEN** the system does not overwrite or delete `currencyRate`

