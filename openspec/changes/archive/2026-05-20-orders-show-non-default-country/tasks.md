## 1. Order Country Visibility Rules

- [x] 1.1 Identify order list and order detail render paths for country display.
- [x] 1.2 Add shared conditional helper/state logic to show country only when non-empty and not `FI`.
- [x] 1.3 Normalize country comparison to avoid casing issues.

## 2. UI Integration

- [x] 2.1 Add country field rendering to order list rows for non-default country orders.
- [x] 2.2 Add country field rendering to order detail view for non-default country orders.
- [x] 2.3 Keep FI/missing-country orders visually unchanged.

## 3. Verification

- [x] 3.1 Add/update tests for list rendering with non-FI, FI, and missing country values.
- [x] 3.2 Add/update tests for detail rendering with non-FI, FI, and missing country values.
- [x] 3.3 Run targeted order list/detail frontend tests and resolve regressions.
