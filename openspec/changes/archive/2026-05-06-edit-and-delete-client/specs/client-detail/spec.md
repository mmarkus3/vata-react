## MODIFIED Requirements

### Requirement: Client Detail Page Navigation
The system SHALL provide a client detail page accessible via the route `/client/[id]` where `[id]` is the client's unique identifier. The page SHALL include actions to create, edit, and delete the client.

#### Scenario: Navigate to client detail from client list
- **WHEN** user taps on a client item in the clients list
- **THEN** system navigates to the client detail page for that client
- **AND** the page URL reflects the client ID (`/client/{clientId}`)

#### Scenario: Display client management actions
- **WHEN** user views the client detail page
- **THEN** system displays actions to edit and delete the client
- **AND** destructive delete action is visually distinct from non-destructive actions

### Requirement: Loading and Error States
The system SHALL handle loading states and errors appropriately during data fetching and client lifecycle operations.

#### Scenario: Loading client data
- **WHEN** user navigates to client detail page
- **THEN** system shows a loading indicator while fetching client data
- **AND** shows a loading indicator while fetching fullfilment data

#### Scenario: Handle missing client
- **WHEN** client with the specified ID does not exist
- **THEN** system displays an error message "Asiakasta ei löytynyt"
- **AND** provides a way to navigate back to the clients list

#### Scenario: Handle fullfilment fetch errors
- **WHEN** fullfilment data cannot be fetched
- **THEN** system displays an error message for the fullfilment sections
- **AND** still displays client information if available

#### Scenario: Handle client update errors
- **WHEN** updating client data fails
- **THEN** system displays an error message
- **AND** keeps edit form open with entered values

#### Scenario: Handle client delete errors
- **WHEN** deleting client fails
- **THEN** system displays an error message
- **AND** keeps user on client detail page
