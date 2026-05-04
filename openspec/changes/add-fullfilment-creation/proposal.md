## Why

Users need to be able to create new fullfilments directly from the client detail page. Currently, fullfilments can only be viewed but not created, requiring users to navigate elsewhere or use external systems. This improves workflow efficiency by allowing fullfilment creation in context.

## What Changes

- Add a "Lisää täyttö" (Add Fullfilment) button to the client detail page
- Create a modal form for entering fullfilment details (date, products with amounts)
- Integrate with existing product selection and fullfilment creation logic
- Refresh the fullfilment list after successful creation
- Maintain consistent UI patterns with other forms in the app

## Capabilities

### New Capabilities
<!-- No new capabilities are being introduced -->

### Modified Capabilities
- `client-detail`: Add fullfilment creation functionality with modal form and product selection

## Impact

- Affects the client detail page (`app/client/[id].tsx`)
- Requires extending the fullfilment service with a create function
- Uses existing product and client data structures
- Follows established modal and form patterns from other parts of the app