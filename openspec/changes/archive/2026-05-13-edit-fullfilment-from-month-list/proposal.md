## Why

Users can view fullfilments in the monthly list (`activeTab === 0`) but cannot open a specific fullfilment for editing. This makes correcting mistakes slow and forces manual workarounds.

## What Changes

- Make fullfilment rows in monthly list tappable/openable.
- Add flow to open fullfilment details from monthly list entry.
- Add editing capability for selected fullfilment (date, products, amounts, and line prices).
- Save updates and refresh client detail fullfilment list after successful edit.

## Capabilities

### New Capabilities
- `fullfilment-edit-from-month-list`: Open and edit fullfilments directly from client monthly view.

### Modified Capabilities
- `client-detail`: Monthly fullfilment list supports opening and editing specific fullfilments.
- `fullfilment-storage-sync`: Edited fullfilment updates must keep storage amount consistency.

## Impact

- Affects client detail UI (`app/client/[id].tsx`) monthly tab list interactions.
- Requires edit modal/screen for fullfilments and update logic in service layer (`services/fullfliment.ts`).
- Requires recalculation/adjustment logic for storage amounts when edited amounts change.
- Requires tests for open/edit/save/error paths and list refresh behavior.
