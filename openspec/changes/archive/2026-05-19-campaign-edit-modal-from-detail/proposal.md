## Why

Campaign detail currently supports viewing only, so users cannot correct or update campaign configuration without leaving context. Enabling editing directly from detail page improves campaign management speed and reduces navigation friction.

## What Changes

- Add campaign editing capability from campaign detail page.
- Add a dedicated edit-campaign modal (separate from create modal) opened from detail page.
- Allow updating key campaign fields and saving changes with existing validation rules.

## Capabilities

### New Capabilities
- `campaign-edit`: Edit existing campaigns from detail page via dedicated modal.

### Modified Capabilities
- `campaign-detail`: Campaign detail page supports edit action and reflects updated campaign data.

## Impact

- Affected frontend likely includes `app/campaign/[id].tsx` and a new edit modal component file.
- Campaign service layer needs update-by-id support.
- i18n keys needed for edit modal labels, actions, and validation states.
- Tests should cover modal open/close, form prefill, validation, and successful save/update behavior.
