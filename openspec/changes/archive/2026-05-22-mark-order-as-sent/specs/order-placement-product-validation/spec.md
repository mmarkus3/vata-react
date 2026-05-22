## MODIFIED Requirements

### Requirement: Place order validates product and stock availability
The system SHALL validate each ordered product exists and requested amounts are available before order placement. If a discount code is provided, the backend SHALL fetch matching campaign from Firestore, validate campaign applicability, and calculate discounted line `finalPrice` for applicable products. Backend order update flow SHALL allow setting status to `sent` for valid company-owned orders.

#### Scenario: Product does not exist
- **WHEN** place order includes unknown product ID
- **THEN** backend rejects order with validation error

#### Scenario: Product stock insufficient
- **WHEN** place order requests amount greater than available stock
- **THEN** backend rejects order with validation error

#### Scenario: Status updated to sent for valid order
- **WHEN** client updates company-owned order status to `sent`
- **THEN** backend persists status change
- **AND** updates order `updated` timestamp

#### Scenario: Status update rejected for company mismatch
- **WHEN** client attempts to set `sent` on order not owned by company
- **THEN** backend rejects update with company mismatch error
