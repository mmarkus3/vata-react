## MODIFIED Requirements

### Requirement: Orders tab shows company order list
The system SHALL fetch and display company orders in the Orders tab list view. Order data SHALL reflect backend-calculated product line pricing, including campaign-code discounted `finalPrice` when applicable.

#### Scenario: Orders are shown in list
- **WHEN** Orders tab loads successfully and orders exist
- **THEN** system displays a list of orders with key row metadata for each order

#### Scenario: Order has campaign code discounted lines
- **WHEN** backend placed order with valid campaign code discounts
- **THEN** returned order data contains product lines with discounted `finalPrice` values
