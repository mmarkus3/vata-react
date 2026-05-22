## ADDED Requirements

### Requirement: Fullfilment inventory side effects are backend-triggered
The system SHALL perform fullfilment inventory adjustments in backend fullfilment document-write triggers instead of client/service-side stock mutation logic.

#### Scenario: Fullfilment saved from any client path updates stock consistently
- **WHEN** fullfilment create/update/delete is persisted to Firestore
- **THEN** backend trigger applies corresponding stock adjustments
- **AND** behavior is independent of originating client path
