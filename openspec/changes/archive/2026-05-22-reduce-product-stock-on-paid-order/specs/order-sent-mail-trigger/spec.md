## ADDED Requirements

### Requirement: Shared order update trigger handles paid stock side effect
The backend order update trigger SHALL process paid-transition stock decrement side effects in addition to existing notification behavior.

#### Scenario: Paid transition executes stock decrement and paid notification logic
- **WHEN** an order transitions to `paid`
- **THEN** backend evaluates and applies product stock decrements
- **AND** backend continues paid-notification mail flow per existing requirements
