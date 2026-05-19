## MODIFIED Requirements

### Requirement: User can open and view campaigns list
The system SHALL provide a campaigns list view where users can browse available campaigns, including campaigns created via campaign creation flow.

#### Scenario: Campaigns list shown
- **WHEN** user opens campaigns screen and campaigns exist
- **THEN** system displays a list of campaign rows

### Requirement: Campaign list shows essential row information
The system SHALL show essential campaign information per row to help users identify each campaign, including campaign mode and validity period summary.

#### Scenario: Campaign row content
- **WHEN** campaigns list is rendered
- **THEN** each row shows campaign name and available summary metadata (such as status, active period, and whether campaign uses code)

### Requirement: Campaign list handles loading, empty, and error states
The system SHALL provide clear campaigns list states during fetch lifecycle.

#### Scenario: Campaigns loading
- **WHEN** campaigns are being fetched
- **THEN** system shows a loading state on campaigns screen

#### Scenario: No campaigns available
- **WHEN** campaigns fetch succeeds and returns zero items
- **THEN** system shows an empty-state message on campaigns screen

#### Scenario: Campaigns fetch fails
- **WHEN** campaigns fetch fails
- **THEN** system shows an error-state message on campaigns screen

### Requirement: Campaign row opens detail page
The system SHALL allow users to open campaign detail page by selecting a campaign row.

#### Scenario: Tap campaign row
- **WHEN** user taps a campaign row
- **THEN** system navigates to corresponding campaign detail route
