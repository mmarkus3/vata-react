## Why

When a product line is removed from an existing fullfilment, stock must be restored for that removed quantity to keep inventory accurate. This behavior needs to be explicit and verified to prevent silent stock drift.

## What Changes

- Ensure fullfilment update flow restores product stock when a product is removed from fullfilment lines.
- Clarify and verify delta handling for removed product lines in backend fullfilment write trigger logic.
- Add targeted tests to guarantee removal restoration behavior remains correct.

## Capabilities

### New Capabilities
- `fullfilment-remove-product-stock-restore`: Explicit product-removal restoration behavior for fullfilment updates.

### Modified Capabilities
- `fullfilment-stock-sync-on-write`: Add explicit requirement coverage for product-line removal during fullfilment update.

## Impact

- Backend fullfilment stock sync trigger delta logic/tests.
- Test coverage for fullfilment update with removed product lines.
