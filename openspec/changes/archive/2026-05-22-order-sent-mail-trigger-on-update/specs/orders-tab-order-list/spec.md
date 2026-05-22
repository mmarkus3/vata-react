## ADDED Requirements

### Requirement: Sent status update delegates customer notification to backend
The system SHALL treat order sent-status updates from the app as status-only writes, and customer sent-notification enqueue side effects SHALL be handled by backend order update triggers.

#### Scenario: App marks order as sent
- **WHEN** user marks an order as `sent` from order detail flow
- **THEN** client updates order status and does not directly create a `mail` document

#### Scenario: Notification still created after app sent action
- **WHEN** app marks order status to `sent` successfully
- **THEN** backend order update trigger enqueues the sent-notification `mail` document
