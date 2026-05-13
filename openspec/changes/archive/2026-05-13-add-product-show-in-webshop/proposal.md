## Why

Users need an explicit way to control whether a product appears in the webshop. Today this visibility is not modeled as a dedicated product property, which makes webshop publishing behavior unclear and difficult to manage.

## What Changes

- Add a `showInWebshop` boolean property to the product data model.
- Surface `showInWebshop` in product create/edit flows so users can set webshop visibility directly.
- Persist `showInWebshop` in Firestore with safe defaulting and no `undefined` writes.
- Ensure product listing and downstream webshop-facing logic read `showInWebshop` consistently.

## Capabilities

### New Capabilities
- `product-webshop-visibility`: Manage product-level webshop visibility through a dedicated `showInWebshop` property across create, edit, persistence, and read flows.

### Modified Capabilities
- `react-hook-form-product-detail`: Extend product detail form requirements to capture and update `showInWebshop`.

## Impact

- Affected code: product type definitions, product form schema/default values, product create/update mapping, Firestore read/write adapters, and any webshop visibility filtering logic.
- Affected data/API: product documents gain `showInWebshop` (boolean).
- Dependencies/systems: Firestore write sanitization rules must remain respected (`undefined` must never be sent).
