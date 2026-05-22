## 1. Backend Status Transition

- [x] 1.1 Verify/update order patch/update path to support status transition to `sent` for company-owned orders.
- [x] 1.2 Ensure backend persists `updated` timestamp on sent transition.
- [x] 1.3 Keep existing company validation and sent-order protection rules consistent.

## 2. Frontend Order Detail Action

- [x] 2.1 Add "mark as sent" action in order detail for non-`sent` statuses.
- [x] 2.2 Call order update API with `{ status: 'sent' }` and handle loading/error states.
- [x] 2.3 Refresh order detail/list state after successful update so segmented lists reflect new status.

## 3. Verification

- [x] 3.1 Add/update backend tests for successful sent status update and company mismatch rejection.
- [x] 3.2 Add/update frontend tests/state tests for action visibility and status transition flow.
- [x] 3.3 Run targeted order backend/frontend tests and resolve regressions.
