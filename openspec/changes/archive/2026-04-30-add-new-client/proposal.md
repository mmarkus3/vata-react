## Why

Users currently can only view existing clients on the clients page. To effectively manage their client relationships, users need the ability to add new clients to the system. This addresses the immediate need to expand client management capabilities beyond read-only access.

## What Changes

- Add a "Add Client" button to the clients page header
- Create a modal form for entering new client information
- Implement client creation functionality with form validation
- Add the new client to Firestore and update the client list automatically

## Capabilities

### New Capabilities
- `client-create`: Allow users to create new clients through a form interface

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- Affects the clients page (`app/home/clients.tsx`)
- Requires extending the client service with create functionality
- Adds a new modal component for client creation
- Uses existing Firebase/Firestore infrastructure for data persistence
- Follows established form patterns from product creation