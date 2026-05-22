## MODIFIED Requirements

### Requirement: Orders tab shows company order list
The system SHALL fetch and display company orders in the Orders tab list view. Order data SHALL reflect backend-calculated product line pricing, including campaign-code discounted `finalPrice` when applicable. The backend pricing metadata endpoint (`getPrices`) SHALL return `delivery` and `over` (free-delivery threshold) in country-aware currency: EUR by default and SEK for country `SE` via currency `getRate`. Same-day rate cache in company options SHALL be used before external fetch. The order list UI SHALL provide segments for statuses `placed`, `paid`, and `sent`, and show orders oldest first within the active segment. User SHALL be able to mark an order as `sent` from order detail workflow, and sent transition SHALL enqueue customer mail notification document.

#### Scenario: User marks order as sent
- **WHEN** user opens an order in eligible status and triggers mark-sent action
- **THEN** system updates order status to `sent`
- **AND** updated status is reflected in order detail and segmented list views
- **AND** system creates mail document using `mail.ts` type with `mail.order` set to order id

#### Scenario: Mark sent action hidden for already sent order
- **WHEN** user opens order already in `sent` status
- **THEN** mark-sent action is not shown

#### Scenario: Mark sent request fails
- **WHEN** status update request fails
- **THEN** system shows error feedback and leaves current order status unchanged in UI
