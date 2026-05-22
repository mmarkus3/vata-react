## Why

Order list currently mixes statuses and does not explicitly prioritize oldest orders first, making fulfillment workflows slower. Segmenting orders by operational status and sorting oldest-first improves clarity and helps teams process backlog in correct sequence.

## What Changes

- Add status segments to order list view for `placed`, `paid`, and `sent`.
- Show only orders belonging to those statuses in segmented view.
- Sort orders oldest first within active segment.
- Preserve existing order row interaction and detail navigation.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `orders-tab-order-list`: Extend order list behavior to use status segments (`placed`, `paid`, `sent`) and oldest-first sorting.

## Impact

- Frontend order list state selectors/filtering/sorting helpers.
- Orders screen UI for segment controls and active-state behavior.
- Tests for segment filtering and chronological sorting.
