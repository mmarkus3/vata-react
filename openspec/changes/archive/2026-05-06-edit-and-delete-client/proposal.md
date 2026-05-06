## Why

Users can currently create and view clients but cannot correct outdated client information or remove clients that are no longer needed. This creates data quality issues and operational clutter in day-to-day usage.

## What Changes

- Add client editing from the client detail page.
- Add client deletion flow with explicit confirmation.
- Reuse existing validation patterns for client form fields.
- Handle successful update/delete with clear user feedback and navigation behavior.

## Capabilities

### New Capabilities
- `client-lifecycle-management`: Editing and deleting existing clients.

### Modified Capabilities
- `client-detail`: Add edit and delete actions with validation, confirmation, and result handling.

## Impact

- Affects client detail page UI (`app/client/[id].tsx`).
- Requires service-layer support for updating and deleting client records (`services/client.ts`).
- Requires modal/dialog components for edit and delete confirmation flows.
- Requires tests for update, delete, validation, and error handling paths.
