## Tasks

### 1. Service and storage support
- [ ] Update `services/storage.ts` to add `uploadProductImage()` and `deleteProductImage()` helpers
- [ ] Update `services/product.ts` to accept product image uploads and URL links during create and update flows
- [ ] Ensure `getProductById()` returns `images: []` when the field is missing

### 2. Product creation UI
- [ ] Extend `components/home/AddProductModal.tsx` to support image link entry and image file selection
- [ ] Add preview, remove, and validation behavior for selected product images
- [ ] Persist product image URLs in `images` when creating a product

### 3. Product editing UI
- [ ] Extend `app/product/[id].tsx` to display a product image gallery
- [ ] Allow adding image URLs and uploading new image files in edit mode
- [ ] Persist updated `images` array on save
- [ ] Allow removing images from the current product image list

### 4. Type safety and data handling
- [ ] Use the existing `Product.images: string[]` type from `types/product.ts`
- [ ] Add any necessary runtime defaults for missing image arrays
- [ ] Keep barcode image flow and `barcode` field behavior unchanged

### 5. Validation and error handling
- [ ] Validate image link format before saving
- [ ] Show clear error messages for upload or URL validation failures
- [ ] Preserve preview state if save fails

### 6. Testing and verification
- [ ] Manually test create/edit flows with image uploads and links
- [ ] Verify Firestore documents persist the `images` array
- [ ] Confirm existing barcode image behavior still works
