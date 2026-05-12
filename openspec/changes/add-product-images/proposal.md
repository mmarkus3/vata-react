## Why

Products currently support a single barcode image and a text barcode field, but the product model already includes an `images: string[]` property in `types/product.ts`. Users need the ability to attach one or more product images to a product record, either by entering a remote image URL or by uploading an image file from their device/computer. This improves product presentation and enables richer product inventory management.

## What Changes

- Extend product creation and editing to support one or more product images
- Support uploading image files from the device or computer via Expo Image Picker
- Support adding image URLs by link
- Persist image URLs in the existing `images: string[]` field on the `Product` model
- Display an image gallery in the product detail page and provide edit controls
- Add storage service helpers for product image upload and optional deletion
- Keep barcode image functionality intact and separate from product images

## Capabilities

### New Capabilities
- `product-image-management`: Add, preview, and persist product images for products via upload or URL

### Modified Capabilities
- `product-detail-edit`: Product detail page now manages the new `images` property and image gallery
- `product-create`: AddProductModal now supports product image selection and image link entry

## Impact

- **UI**: Updated `components/home/AddProductModal.tsx` and `app/product/[id].tsx`
- **Services**: Updated `services/product.ts` and `services/storage.ts`
- **Types**: Uses existing `Product.images: string[]` in `types/product.ts`
- **Storage**: New upload helper for `product-images/` storage paths
- **Data**: Products in Firestore will persist `images` as an array of image URLs
- **Testing**: Add coverage for upload/link behavior and product image data flow
