## Why

Fullfilment-driven stock updates are currently tied to frontend/service flows, which makes inventory consistency dependent on specific client paths. Moving this logic to backend document-write triggers ensures stock stays correct for create/update/delete changes regardless of the caller.

## What Changes

- Move fullfilment product stock alteration logic to backend Firestore trigger using `onDocumentWritten` on fullfilment documents.
- Handle create, update, and delete cases by calculating inventory delta from before/after fullfilment product lines.
- Reuse the same stock-altering utility functions used by paid-order stock decrement by extracting shared logic to a common backend module.
- Keep stock validation and atomic all-or-nothing updates in backend transaction flow.

## Capabilities

### New Capabilities
- `fullfilment-stock-sync-on-write`: Backend-triggered stock synchronization for fullfilment writes.

### Modified Capabilities
- `fullfilment-storage-sync`: Inventory sync source-of-truth changes from client/service flow to backend fullfilment document-write trigger.
- `paid-order-stock-decrement`: Stock alteration helper functions are shared from a common backend module used by both paid-order and fullfilment flows.

## Impact

- Backend trigger code under `functions/src/on-item`.
- Shared stock utility module extracted under backend functions codebase.
- Existing frontend/service fullfilment stock-altering path refactored or removed.
- Backend/frontend tests updated for trigger-based fullfilment stock behavior and shared helper reuse.
