## ADDED Requirements

### Requirement: Paid-order and fullfilment flows share stock utility module
The backend SHALL use shared stock-alteration utility functions for both paid-order and fullfilment stock sync flows.

#### Scenario: Shared helper used by both triggers
- **WHEN** paid-order decrement or fullfilment stock sync executes
- **THEN** both flows use the same common stock calculation and validation utility layer
