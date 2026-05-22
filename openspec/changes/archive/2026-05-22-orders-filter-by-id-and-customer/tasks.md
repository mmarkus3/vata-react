## 1. Orders filter UI

- [x] 1.1 Add text input on orders list screen for filtering by order/customer query.
- [x] 1.2 Add or update translation strings for filter placeholder/label and filtered empty-state text.

## 2. Filter logic integration

- [x] 2.1 Extend orders list state helper to filter by order id, customer name, and customer email (case-insensitive).
- [x] 2.2 Ensure text filter is applied on top of selected segment and keeps oldest-first sorting.
- [x] 2.3 Handle missing customer fields safely in filtering logic.

## 3. Verification

- [x] 3.1 Add/update unit tests for id/name/email matching and case-insensitive behavior.
- [x] 3.2 Add/update tests for segment + query combined behavior and cleared-query reset.
- [x] 3.3 Run targeted frontend tests for orders list state/UI and fix regressions.
