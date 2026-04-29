## Design

### Overview

The barcode image upload feature extends the existing product creation flow without changing the core product model. Users will be able to choose an image from their device or capture a new photo during product creation. The image is uploaded to Firebase Storage, and the resulting download URL is saved in the Firestore product document.

### UI Flow

1. User taps `Lisää tuote` on the storage screen.
2. The add-product modal opens with standard fields: name, amount, price, EAN, barcode text.
3. A new barcode image upload section appears with a button such as `Lataa viivakoodi`.
4. When the user selects or captures an image, a thumbnail preview is shown.
5. On form submit, the app uploads the image first, then creates/updates the Firestore product document with `barcode`.
6. After successful save, the product list refreshes automatically and the modal closes.

### Data Model

- Keep `ean` fields as typed fallback values.

### Storage Strategy

- Upload barcode images to Firebase Storage under a path such as:
  - `barcodes/{companyId}/{productId}/{timestamp}-{originalFilename}`
- Use `getDownloadURL` to retrieve a stable access URL.
- Store that URL in the Firestore product document.

### Implementation Details

- Use Expo image picker or a compatible RN image picker library.
- In `AddProductModal`:
  - Add state for selected barcode image asset.
  - Add upload button and preview renderer.
  - Add client-side validation ensuring the image is uploaded before save when present.
- In `services/product.ts`:
  - Extend `createProduct` to accept barcode image metadata.
  - If an image is provided, upload it and include the URL in the Firestore record.
- In new `services/storage.ts` helper:
  - Add an upload helper using Firebase Storage APIs.

### Error Handling

- Show clear validation errors if image selection fails.
- Handle storage upload failures separately from Firestore writes.
- Provide fallback behavior so typed barcode/EAN still works if the user skips image upload.
