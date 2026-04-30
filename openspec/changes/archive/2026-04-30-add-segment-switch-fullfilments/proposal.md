## Why

Users need to be able to easily switch between viewing fullfilments grouped by month and grouped by product. Currently both views are shown simultaneously, which can be overwhelming and take up too much screen space. A segment switch will provide a cleaner, more focused user experience.

## What Changes

- Add a segment control (tab switcher) to toggle between "Kuukausittain" (by month) and "Tuotteittain" (by product) views
- Show only the selected fullfilment view at a time
- Maintain the existing data loading and error handling
- Keep the client information section always visible

## Capabilities

### New Capabilities
<!-- No new capabilities are being introduced -->

### Modified Capabilities
- `client-detail`: Add segment switch to toggle between fullfilment grouping views

## Impact

- Affects the client detail page (`app/client/[id].tsx`)
- Uses existing React Native components for segment control
- No changes to data fetching or service layer
- Maintains existing responsive design patterns