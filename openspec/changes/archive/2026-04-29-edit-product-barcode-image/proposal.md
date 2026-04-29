## Why

Products currently store barcode image URLs in the `barcode` field, but the detail screen does not let users remove or replace the image once it is saved. This creates stale barcode data and makes the product edit flow incomplete for users who need to update a barcode image after initial upload.

## What Changes

- Add an editable barcode image section to the product detail/edit screen.
- Allow users to remove an existing barcode image and save the product without it.
- Allow users to upload a new barcode image and replace the current one.
- Persist the new barcode image URL in `product.barcode` and handle delete operations cleanly.
- Update UI to show an image preview, upload controls, and conditional fallback when no image exists.

## Capabilities

### New Capabilities
- `barcode-image-edit`: Editable barcode image management on product detail pages, including remove and replace flows.

### Modified Capabilities
- `<existing-name>`: <what requirement is changing>

## Impact

- `app/product/[id].tsx`: UI updates for edit mode, image preview, upload, and remove controls.
- `services/product.ts`: Extend product update logic to upload new barcode images, delete old ones, and persist `barcode` URL updates.
- Firebase Storage: support image replacement and cleanup of removed images.
- Product data model: continue using `barcode` for URL values, with improved edit flow.
- Testing: add coverage for barcode image replace and removal behavior.
