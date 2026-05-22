## 1. Segmented Order List State

- [x] 1.1 Add order segment model for `placed`, `paid`, `sent`.
- [x] 1.2 Implement filtering helper to return only orders in active segment.
- [x] 1.3 Implement oldest-first sort by `updated` date for filtered orders.

## 2. Orders Screen UI

- [x] 2.1 Add segment controls in orders tab for `placed`, `paid`, `sent`.
- [x] 2.2 Bind segment state to filtered+sorted order list rendering.
- [x] 2.3 Keep existing order row tap navigation and visual style compatibility.

## 3. Verification

- [x] 3.1 Add/update tests for segment filtering (`placed`/`paid`/`sent`).
- [x] 3.2 Add/update tests for oldest-first sorting behavior and invalid date fallback.
- [x] 3.3 Run targeted order list frontend tests and resolve regressions.
