## Why

Users can add images only when creating a product, but cannot add or update images later for existing products. This creates rework and blocks normal catalog maintenance when product imagery is missing or outdated.

## What Changes

- Add support for uploading one or more images to an existing product from the product detail flow.
- Allow users to review and save newly added images as part of a product update.
- Persist newly added product images so they are available anywhere product images are rendered.

## Capabilities

### New Capabilities
- `product-image-management`: Add and persist images for already-created products through the product detail/edit experience.

### Modified Capabilities
- `storage-product-list`: Product data shown in storage views must include updated image collections after editing an existing product.

## Impact

- Affected UI: product detail/edit screens and image selection/upload controls.
- Affected data flow: product update mutation/service and image storage integration.
- Affected consumers: any list/detail view that reads product image URLs from stored product data.
