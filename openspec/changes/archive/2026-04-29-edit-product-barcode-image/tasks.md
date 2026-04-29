## 1. Product Detail UI

- [x] 1.1 Add a barcode image section to the product detail edit screen.
- [x] 1.2 Display the current barcode image preview when `product.barcode` is an image URL.
- [x] 1.3 Show a remove button when an image URL exists.
- [x] 1.4 Show an upload button for selecting a new barcode image.

## 2. Image Removal and Replacement

- [x] 2.1 Implement remove image behavior and clear the barcode URL.
- [x] 2.2 Implement new image selection and preview before saving.
- [x] 2.3 Persist image replacement by uploading to Firebase Storage and updating `product.barcode`.

## 3. Service Layer

- [x] 3.1 Extend `services/product.ts` to support deleting existing barcode Storage objects when images are removed or replaced.
- [x] 3.2 Ensure `updateProduct` handles the case where `barcode` becomes a new URL.
- [x] 3.3 Preserve current product fields when updating barcode image data.

## 4. Validation and Feedback

- [x] 4.1 Add upload progress state and disable save during upload.
- [x] 4.2 Show user-friendly error messages for upload/delete failures.
- [x] 4.3 Confirm success and keep the user on the product detail screen.

## 5. Testing and Validation

- [x] 5.1 Verify product detail edit mode can remove an existing barcode image.
- [x] 5.2 Verify product detail edit mode can replace an existing barcode image.
- [x] 5.3 Run TypeScript compilation check.
