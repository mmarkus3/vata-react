## ADDED Requirements

### Requirement: Orders segment list can be filtered by order and customer query
The order list UI SHALL apply user-entered text filtering to the currently selected segment (`placed`, `paid`, or `sent`) using order id, customer name, and customer email fields.

#### Scenario: Segment and text filter combine
- **WHEN** user selects a segment and enters filter text
- **THEN** list contains only orders in that segment that match id/name/email query

#### Scenario: Clearing text filter restores segment list
- **WHEN** user clears filter text
- **THEN** list returns to showing all orders in selected segment (with existing sort)

#### Scenario: No matching orders for query
- **WHEN** selected segment has no orders matching entered query
- **THEN** system shows an empty-state message for filtered results
