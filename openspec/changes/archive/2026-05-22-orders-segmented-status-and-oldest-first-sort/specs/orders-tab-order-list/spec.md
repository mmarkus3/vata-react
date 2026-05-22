## MODIFIED Requirements

### Requirement: Orders tab shows company order list
The system SHALL fetch and display company orders in the Orders tab list view. Order data SHALL reflect backend-calculated product line pricing, including campaign-code discounted `finalPrice` when applicable. The backend pricing metadata endpoint (`getPrices`) SHALL return `delivery` and `over` (free-delivery threshold) in country-aware currency: EUR by default and SEK for country `SE` via currency `getRate`. Same-day rate cache in company options SHALL be used before external fetch. The order list UI SHALL provide segments for statuses `placed`, `paid`, and `sent`, and show orders oldest first within the active segment.

#### Scenario: Orders are shown in list
- **WHEN** Orders tab loads successfully and orders exist
- **THEN** system displays a list of orders with key row metadata for each order

#### Scenario: Segment filters orders by status
- **WHEN** user selects `placed`, `paid`, or `sent` segment
- **THEN** list shows only orders with matching status

#### Scenario: Segment excludes non-segment statuses
- **WHEN** orders contain statuses outside `placed`, `paid`, `sent`
- **THEN** those orders are not shown in segmented list

#### Scenario: Orders sorted oldest first
- **WHEN** orders are shown in selected segment
- **THEN** list is sorted by created time ascending (oldest first)
