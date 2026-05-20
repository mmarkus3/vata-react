## Why

Campaign pricing currently applies one fixed price value across targeted products, which is too limiting when different campaign products need different fixed prices. Users need per-product fixed price control during both campaign creation and editing.

## What Changes

- Support setting fixed price individually per selected product in campaign create flow.
- Support updating fixed prices individually per selected product in campaign edit flow.
- Keep percentage campaigns unchanged (shared percentage logic remains as-is).

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `campaign-create`: Fixed-price discount mode supports product-level fixed prices.
- `campaign-edit`: Edit modal supports product-level fixed price updates.

## Impact

- Affected frontend likely includes campaign form state, create modal, edit modal, and payload mapping logic.
- Campaign product type/payload handling may need refinement for per-line fixed values.
- Tests should cover per-product fixed price validation and payload mapping in create/edit flows.
