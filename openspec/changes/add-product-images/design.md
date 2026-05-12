## Context

The application already uses Expo, Firebase Firestore, and Firebase Storage. Product creation and editing flows currently support barcode image upload and barcode text entry, and the product model already declares `images: string[]`. The new feature should reuse existing patterns for image selection, storage upload, and form validation.

## Design

### Service Layer
- Add `uploadProductImage()` to `services/storage.ts` to upload image files under `product-images/{companyId}/{productId}`.
- Add `deleteProductImage()` helper for optional image cleanup.
- Update `services/product.ts` to handle `images` during create and update operations.
- Ensure `getProductById()` defaults `images` to an empty array when missing.

### Product Creation
- Update `components/home/AddProductModal.tsx` to allow:
  - entering a product image URL
  - uploading one or more image files
  - previewing selected images before save
  - removing selected images before creation
- Preserve existing barcode image behavior separately.

### Product Editing
- Update `app/product/[id].tsx` to display a product image gallery and edit controls.
- Allow users to:
  - add image URLs
  - upload additional image files
  - remove images from the current product
- Persist edits to Firestore in the `images` array.

### Data Flow
- Create product with initial `images` array from URL links.
- Upload local image files after initial product save and append returned storage URLs.
- On edit, keep current URL entries and upload newly chosen local files before saving.
- Use `images` as the canonical product image source for UI rendering.

### UI/UX
- Product images should be shown as a horizontal or stacked gallery in the detail page.
- Image upload and link entry should be clearly labeled as product images, distinct from barcode image support.
- Validation should reject invalid image links and only accept well-formed URLs.
- Provide remove controls for image previews.

### Risks / Trade-offs
- Not all image URLs may be previewable; restrict direct link validation to `http(s)`.
- Deleting images from the product does not immediately delete remote storage files unless explicitly tracked.
- Existing products without `images` must still load safely.
