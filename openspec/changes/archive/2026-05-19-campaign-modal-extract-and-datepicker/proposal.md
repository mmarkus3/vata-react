## Why

Campaign creation modal logic currently lives inside the campaigns screen, making the screen hard to maintain and test. Start/end date entry also relies on free-text input, which is error-prone and causes avoidable validation failures.

## What Changes

- Extract campaign creation modal UI and related interaction props into its own component file.
- Replace start/end text inputs with datepicker-based selection for both dates.
- Keep existing campaign creation behavior (targeting, discount, validation, save) unchanged except date input UX.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `campaign-create`: Campaign create UI implementation changes to modular modal component and datepicker-based start/end selection.

## Impact

- Affected frontend likely includes `app/(home)/campaigns.tsx` and a new campaign modal component under `components/` or `app/campaign/`.
- Date input handling and formatting in campaign form state may need adjustment for datepicker outputs.
- Tests should cover extracted modal behavior and date selection interactions.
