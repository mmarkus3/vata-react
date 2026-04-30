## Why

Users need to view detailed information about their clients and track fullfilments associated with each client. Currently, there's no way to see client details or their fullfilment history. This addresses the need for better client management and fullfilment tracking capabilities.

## What Changes

- Create a new client detail page accessible from the client list
- Display client information (name, company, contact details, address)
- Show fullfilments grouped by month
- Show fullfilments grouped by product and month
- Add navigation from client list items to client detail page

## Capabilities

### New Capabilities
- `client-detail`: Display detailed client information and fullfilment history with monthly groupings

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- Affects the clients page (`app/home/clients.tsx`) to add navigation
- Creates new client detail page (`app/client/[id].tsx`)
- Requires extending client service with fullfilment queries
- Uses existing Firebase/Firestore infrastructure for data access
- Follows established navigation patterns from product detail pages