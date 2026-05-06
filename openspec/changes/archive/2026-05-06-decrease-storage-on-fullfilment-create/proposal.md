## Why

When users create a fullfilment, product amounts in storage currently stay unchanged, which causes stock levels to drift from reality. This should be corrected now to keep inventory accurate for reporting and day-to-day operations.

## What Changes

- Decrease storage product amount automatically when a fullfilment is created.
- Validate that each fullfilment product has enough stock before creation is finalized.
- Prevent creation and show a clear error when stock is insufficient.
- Keep fullfilment creation and storage updates consistent so partial updates are avoided.

## Capabilities

### New Capabilities
- `fullfilment-storage-sync`: Synchronize fullfilment creation with storage inventory deduction.

### Modified Capabilities
- `client-detail`: Fullfilment creation behavior now includes inventory validation and stock deduction.
- `storage-product-list`: Product amounts must reflect deductions caused by created fullfilments.

## Impact

- Affects `services/fullfliment.ts` and storage/product related services.
- Affects fullfilment creation modal flow in `components/clients/AddFullfilmentModal.tsx`.
- Impacts client detail page behavior in `app/client/[id].tsx`.
- Requires safe multi-document Firestore update flow (or equivalent atomic approach).
