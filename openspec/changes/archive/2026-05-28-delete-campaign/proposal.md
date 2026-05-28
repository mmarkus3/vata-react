## Why

Users can create and edit campaigns, but there is no way to remove campaigns that are obsolete, created by mistake, or no longer relevant. Campaign deletion completes the campaign lifecycle and helps keep campaign lists clean.

## What Changes

- Add a delete action to the campaign detail page.
- Require user confirmation before deleting a campaign.
- Delete the campaign from Firestore using the client-side Firebase service layer.
- Navigate the user back to the campaigns list after successful deletion.
- Show localized error feedback if deletion fails and keep the user on the detail page.

## Capabilities

### New Capabilities
- `campaign-delete`: Delete an existing campaign from its detail page with confirmation and safe post-delete navigation.

### Modified Capabilities

## Impact

- Affected code: `app/campaign/[id].tsx`, `services/campaign.ts`, campaign translations, and focused frontend/service tests.
- Data: campaign document is removed from the `campaigns` collection; no schema migration is required.
- Backend: no backend API changes; the management UI should use Firebase client-side deletion like other internal data mutations.
