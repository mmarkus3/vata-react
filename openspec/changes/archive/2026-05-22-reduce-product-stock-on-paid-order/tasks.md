## 1. Trigger stock decrement implementation

- [x] 1.1 Extend existing `onDocumentUpdated('/orders/{orderId}')` flow to detect non-`paid` -> `paid` transition for inventory updates.
- [x] 1.2 Implement product stock decrement for each order line amount.
- [x] 1.3 Enforce product existence and sufficient stock checks before writing.
- [x] 1.4 Apply decrements atomically (transaction/all-or-nothing) across all lines.

## 2. Integration safety

- [x] 2.1 Ensure paid-transition decrement runs only once per order status transition.
- [x] 2.2 Keep existing paid/sent notification behavior intact in same trigger.

## 3. Verification

- [x] 3.1 Add/update backend tests for successful paid decrement across multiple products.
- [x] 3.2 Add/update backend tests for insufficient stock and missing product rollback behavior.
- [x] 3.3 Add/update backend tests confirming no duplicate decrement on already-paid updates.
- [x] 3.4 Run targeted tests for order update trigger and related order/stock behavior.
