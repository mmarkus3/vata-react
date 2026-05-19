## MODIFIED Requirements

### Requirement: Secondary sections are accessed through menu icon
The system SHALL provide a menu-icon trigger in home navigation that reveals secondary destinations via a popover overlay, instead of opening a dedicated full-page menu route.

#### Scenario: Open secondary menu popover
- **WHEN** user taps the menu icon entry in tab navigation
- **THEN** system opens a popover showing menu options for `Asiakkaat`, `Kategoriat`, `Kampanjat`, and `Profiili`

#### Scenario: Close secondary menu popover
- **WHEN** user taps outside the popover or selects a menu item
- **THEN** system closes the popover

### Requirement: Menu options navigate to existing secondary routes
The system SHALL navigate to existing screens when a secondary menu item is selected.

#### Scenario: Navigate to asiakkaat from menu
- **WHEN** user selects `Asiakkaat` from menu
- **THEN** system navigates to clients screen route

#### Scenario: Navigate to kategoriat from menu
- **WHEN** user selects `Kategoriat` from menu
- **THEN** system navigates to categories screen route

#### Scenario: Navigate to kampanjat from menu
- **WHEN** user selects `Kampanjat` from menu
- **THEN** system navigates to campaigns screen route

#### Scenario: Navigate to profiili from menu
- **WHEN** user selects `Profiili` from menu
- **THEN** system navigates to profile/settings screen route
