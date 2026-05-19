## Why

Campaign listing exists, but users cannot yet create campaigns with clear discount behavior for checkout-code and auto-applied campaigns. Campaign creation is needed to manage promotions with company ownership, validity window, and product targeting.

## What Changes

- Add campaign creation capability in app UI and data layer.
- Support campaign code behavior: coded campaigns apply at webshop checkout; campaigns without code apply discount directly to campaign products.
- Support campaign start/end time and company assignment from authenticated user's profile.
- Support campaign product targeting: individual product selection, all products, or all products in selected category.
- Support discount type selection: percentage from retail price or fixed price.

## Capabilities

### New Capabilities
- `campaign-create`: Create campaigns with discount behavior, targeting scope, and validity window.

### Modified Capabilities
- `campaign-list`: Campaign list must include newly created campaigns and enough summary metadata to identify their configuration.

## Impact

- Affected frontend likely includes campaigns screen(s), form state/validation, and category/product selection UI.
- Affected services include campaign persistence and potentially product price resolution logic for no-code campaigns.
- i18n additions required for campaign form fields, targeting options, and validation messages.
- Tests needed for creation validation rules and campaign discount behavior decisions.
