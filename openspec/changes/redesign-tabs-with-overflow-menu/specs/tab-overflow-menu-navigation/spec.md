## ADDED Requirements

### Requirement: Primary tabs stay focused on core workflows
The system SHALL keep `Varasto`, `Tilaukset`, and `Raportti` as visible primary tabs in home navigation.

#### Scenario: Primary tabs visible after redesign
- **WHEN** user views the home tab bar
- **THEN** `Varasto`, `Tilaukset`, and `Raportti` are directly visible as tabs

### Requirement: Secondary sections are accessed through menu icon
The system SHALL provide a menu-icon trigger in home navigation that reveals secondary destinations.

#### Scenario: Open secondary menu
- **WHEN** user taps the menu icon entry in tab navigation
- **THEN** system shows menu options for `Asiakkaat`, `Kategoriat`, and `Profiili`

### Requirement: Menu options navigate to existing secondary routes
The system SHALL navigate to existing screens when a secondary menu item is selected.

#### Scenario: Navigate to asiakkaat from menu
- **WHEN** user selects `Asiakkaat` from menu
- **THEN** system navigates to clients screen route

#### Scenario: Navigate to kategoriat from menu
- **WHEN** user selects `Kategoriat` from menu
- **THEN** system navigates to categories screen route

#### Scenario: Navigate to profiili from menu
- **WHEN** user selects `Profiili` from menu
- **THEN** system navigates to profile/settings screen route
