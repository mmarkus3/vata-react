## Why

Users currently cannot maintain key nutrition values on products in create/edit flows, even though the product model already contains nutrition-related fields. This blocks accurate product metadata management and makes nutrition information incomplete in the system.

## What Changes

- Add support for entering and saving nutrition fields on new product creation.
- Add support for editing and saving the same nutrition fields on existing products.
- Ensure product reads return persisted nutrition field values for detail/list consumers.

## Capabilities

### New Capabilities
- `product-nutrition-management`: Manage product nutrition values (energy, fat, carbohydrates, protein, salt, fiber) across create and edit flows.

### Modified Capabilities
- `storage-product-list`: Product data used in storage list/detail flows must include persisted nutrition fields after create or edit.

## Impact

- Affected UI: add-product modal and product detail/edit screens.
- Affected data model flow: create/update payload mapping and read normalization for optional nutrition numeric fields.
- Affected consumers: product detail and any storage/list data readers relying on product shape.
