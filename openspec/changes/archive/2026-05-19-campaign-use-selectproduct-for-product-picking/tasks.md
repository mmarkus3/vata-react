## 1. SelectProduct Reuse Design

- [x] 1.1 Analyze current `SelectProduct` usage and identify minimal prop extensions for campaign flow.
- [x] 1.2 Update `SelectProduct` component API to support campaign selection without breaking current consumers.
- [x] 1.3 Keep backward-compatible defaults for existing fulfillments/client flows.

## 2. Campaign Integration

- [x] 2.1 Replace inline campaign selected-products UI with `SelectProduct` integration.
- [x] 2.2 Wire selected product IDs/state updates from `SelectProduct` into campaign create form.
- [x] 2.3 Preserve campaign validation rule requiring one or more selected products when targeting mode is selected-products.

## 3. Verification

- [x] 3.1 Add/update unit tests for new `SelectProduct` behavior and props.
- [x] 3.2 Add/update campaign create tests to cover `SelectProduct`-driven selection flow.
- [x] 3.3 Run targeted tests for `SelectProduct`, campaign create modal/state, and resolve regressions.
