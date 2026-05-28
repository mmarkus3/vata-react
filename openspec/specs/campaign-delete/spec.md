# campaign-delete Specification

## Purpose
TBD - created by archiving change delete-campaign. Update Purpose after archive.
## Requirements
### Requirement: User can delete campaign from detail page
The system SHALL allow a user to delete an existing campaign from the campaign detail page after an explicit confirmation.

#### Scenario: Delete action is available on campaign detail
- **WHEN** a user opens a campaign detail page for an existing campaign
- **THEN** the system shows a delete action for that campaign

#### Scenario: User cancels deletion
- **WHEN** a user chooses the delete action and cancels the confirmation
- **THEN** the campaign remains unchanged
- **AND** the user stays on the campaign detail page

#### Scenario: User confirms deletion
- **WHEN** a user confirms deletion for the current campaign
- **THEN** the system deletes the campaign document from Firestore
- **AND** navigates the user back to the campaigns list

### Requirement: Campaign deletion handles in-progress and failed states
The system SHALL prevent duplicate delete submissions while deletion is in progress and SHALL show localized error feedback if deletion fails.

#### Scenario: Delete request is in progress
- **WHEN** campaign deletion has been confirmed and the delete request has not finished
- **THEN** the system disables the delete action
- **AND** shows a loading state for the delete action

#### Scenario: Delete request fails
- **WHEN** campaign deletion fails
- **THEN** the system keeps the user on the campaign detail page
- **AND** shows localized deletion error feedback
- **AND** allows the user to try deleting again

