## Why

Campaign create flow currently uses custom inline product selection UI. Reusing `SelectProduct` (with targeted modifications) reduces duplicate selection logic, improves consistency with existing workflows, and makes campaign product picking easier to maintain.

## What Changes

- Reuse `SelectProduct` component in campaign creation flow for product selection.
- Modify `SelectProduct` so it supports campaign use-case requirements (selection behavior, display context, and callbacks).
- Replace campaign-specific inline product list selector with `SelectProduct` integration.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `campaign-create`: Product selection interaction for selected-products targeting is implemented via `SelectProduct`.

## Impact

- Affected files likely include `components/clients/SelectProduct.tsx` and campaign create modal/screen files.
- `SelectProduct` props/types may expand for reuse across fulfillment and campaign contexts.
- Tests should cover both existing consumer behavior and campaign-specific selection flow.
