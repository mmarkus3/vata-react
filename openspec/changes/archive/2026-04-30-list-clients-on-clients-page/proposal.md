## Why

The clients page currently shows an empty screen. Users need to be able to view and manage their clients to effectively use the storage management platform. This change addresses the immediate need to display client information in a user-friendly list format.

## What Changes

- Implement client listing functionality on the clients page
- Display clients in a scrollable list with key information (name, company, contact details)
- Follow the existing design patterns from the products page for consistency

## Capabilities

### New Capabilities
- `client-list`: Display a list of clients with their basic information and contact details

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- Affects the clients page (`app/home/clients.tsx`)
- Requires creating client service operations and hooks
- Uses existing Firebase/Firestore infrastructure for data access
- Follows established UI patterns from products functionality