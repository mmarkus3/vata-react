## Why

Products currently lack dedicated fields for retail price (vähittäismyyntihinta) and unit price per kilogram (kilohinta), which limits pricing clarity in daily operations. Users need to set and maintain these values both when creating new products and when editing existing products.

## What Changes

- Add support for entering and saving `retailPrice` and `unitPrice` when creating a new product.
- Add support for editing and saving `retailPrice` and `unitPrice` for an existing product.
- Ensure product reads and product list/detail consumers receive the stored `retailPrice` and `unitPrice` values.

## Capabilities

### New Capabilities
- `product-price-extensions`: Manage retail price and per-kilogram unit price across product create and edit flows.

### Modified Capabilities
- `storage-product-list`: Product data used in storage list/detail flows must include persisted `retailPrice` and `unitPrice` values after create or edit.

## Impact

- Affected UI: add-product modal and product detail/edit screens.
- Affected data model: product payload mapping and update/read pathways for optional numeric pricing fields.
- Affected consumers: product list/detail components and any downstream pricing displays that use product fields.
