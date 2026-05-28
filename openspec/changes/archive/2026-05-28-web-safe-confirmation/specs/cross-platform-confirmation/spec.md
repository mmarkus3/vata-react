## ADDED Requirements

### Requirement: Confirmation uses native and web-specific APIs
The system SHALL provide a reusable confirmation API that uses React Native `Alert.alert` on native platforms and browser `window.confirm` on web.

#### Scenario: Native confirmation prompt
- **WHEN** code requests confirmation on a native platform
- **THEN** the system shows a React Native alert with cancel and confirm actions

#### Scenario: Web confirmation prompt
- **WHEN** code requests confirmation on web
- **THEN** the system calls `window.confirm` with the confirmation text

#### Scenario: Web confirmation accepted
- **WHEN** `window.confirm` returns true
- **THEN** the system executes the confirm callback

#### Scenario: Web confirmation cancelled
- **WHEN** `window.confirm` returns false
- **THEN** the system does not execute the confirm callback

### Requirement: Delete confirmations use shared confirmation API
The system SHALL use the shared confirmation API for destructive delete confirmations instead of calling React Native `Alert.alert` directly from delete screens.

#### Scenario: Product delete confirmation uses shared API
- **WHEN** a user deletes a product
- **THEN** the product delete confirmation is routed through the shared confirmation API

#### Scenario: Campaign delete confirmation uses shared API
- **WHEN** a user deletes a campaign
- **THEN** the campaign delete confirmation is routed through the shared confirmation API

#### Scenario: Category delete confirmation uses shared API
- **WHEN** a user deletes a category
- **THEN** the category delete confirmation is routed through the shared confirmation API
