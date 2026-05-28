## Why

Company options currently affect checkout pricing, delivery, VAT, payment configuration, and order notifications, but users cannot manage those values from the app. Adding an options page under the menu gives company users a direct way to review and update editable operational settings without touching backend data manually.

## What Changes

- Add a menu entry for company options.
- Add a new company options page that loads the signed-in user's company options from `options/{companyId}`.
- Allow users to edit supported option fields and save them back to Firestore.
- Exclude `currencyRate` from the form so cached exchange-rate data remains system-managed.
- Preserve existing `currencyRate` data when saving edited options.
- Localize visible labels, loading states, validation errors, and save feedback.

## Capabilities

### New Capabilities
- `company-options-management`: Covers listing and editing company option fields from a menu page while leaving system-managed currency-rate cache hidden and preserved.

### Modified Capabilities

## Impact

- Frontend routes under `app/(home)` for the new options page.
- Overflow menu configuration and navigation labels.
- Firestore client-side service code for reading and updating `options/{companyId}`.
- `types/options.ts` usage remains compatible; `currencyRate` stays part of the data model but is not exposed in the UI.
- Jest coverage for mapping, saving, and UI behavior around excluded fields.
