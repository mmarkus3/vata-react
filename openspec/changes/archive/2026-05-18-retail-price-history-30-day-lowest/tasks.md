## 1. Data Model and Persistence

- [x] 1.1 Extend product pricing model/types to include retail price history entries with price value and date metadata.
- [x] 1.2 Update product create flow persistence to initialize retail-price-history metadata when `retailPrice` is provided.
- [x] 1.3 Update product edit persistence so retail price history is appended only when `retailPrice` value changes, storing previous value with change date.
- [x] 1.4 Add bounded retention/cleanup logic for retail price history entries to avoid unbounded product document growth.

## 2. Lowest-30-Day Price Computation

- [x] 2.1 Implement shared pricing utility/service logic to compute lowest retail price in the previous 30 days from current + historical entries.
- [x] 2.2 Integrate lowest-30-day computation into product read mapping used by product detail and listing consumers.
- [x] 2.3 Define fallback behavior for products without history (or partial history) and ensure returned payload stays Firestore-safe.

## 3. UI Consumption and Validation

- [x] 3.1 Expose computed lowest-30-day retail price field(s) through product detail/list view models needed by UI display.
- [x] 3.2 Add/update localized display text bindings for “lowest price in previous 30 days” where product retail price is shown.
- [x] 3.3 Validate create/edit flows still persist existing pricing fields correctly while adding history behavior.

## 4. Test Coverage

- [x] 4.1 Add/update service tests for retail price history initialization and change-only history appends.
- [x] 4.2 Add/update computation tests for lowest-30-day price logic (including no-history, unchanged price, and out-of-window entries).
- [x] 4.3 Add/update product read mapping tests to verify lowest-30-day value is returned for product detail/list consumers.
