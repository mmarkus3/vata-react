## MODIFIED Requirements

### Requirement: Place order validates product and stock availability
The system SHALL validate each ordered product exists and requested amounts are available before order placement. If a discount code is provided, the backend SHALL fetch matching campaign from Firestore, validate campaign applicability, and calculate discounted line `finalPrice` for applicable products. Backend order update flow SHALL allow setting status to `sent` for valid company-owned orders and SHALL trigger mail notification pipeline for sent orders.

#### Scenario: Status updated to sent for valid order
- **WHEN** client updates company-owned order status to `sent`
- **THEN** backend persists status change
- **AND** updates order `updated` timestamp
- **AND** creates mail document to DB using `mail.ts` type
- **AND** sets `mail.order` to updated order id

#### Scenario: onMail constructs sent-order email content
- **WHEN** `onMail` processes sent-order mail document
- **THEN** email title is `Tilauksesi on lähetetty`
- **AND** email body includes order id, customer information, and product lines

#### Scenario: Status update rejected for company mismatch
- **WHEN** client attempts to set `sent` on order not owned by company
- **THEN** backend rejects update with company mismatch error
