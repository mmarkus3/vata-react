## Why

Current product creation supports only typed values for barcode/EAN, but many users rely on barcode images for inventory scanning and product identification. Allowing barcode image upload directly from the storage page makes product entry faster, reduces manual errors, and supports real-world workflows where the barcode is captured from packaging.

## What Changes

- Add a barcode image upload flow to the product creation experience on the storage page.
- Extend the product form to allow selecting or capturing a barcode image.
- Upload the barcode image to Firebase Storage and store a reference URL in the product document.
- Preserve existing typed product fields while adding image support as the preferred barcode input.
- Display the barcode image in the storage product list item when available.

## Capabilities

### New Capabilities
- `product-barcode-image-upload`: Enable users to attach barcode images to products during creation and store those images in Firebase Storage.

### Modified Capabilities
- `storage-product-creation`: Extend the existing product creation flow to support barcode image upload.

## Impact

- Updates to `app/home/index.tsx` and the product creation modal component(s).
- New UI for image selection/capture, preview, and upload state.
- New Firebase Storage helper to upload barcode images and return a download URL.
- `services/product.ts` must save the barcode image metadata alongside product details.
- `components/home/ProductListItem.tsx` should render a barcode image preview when present.
