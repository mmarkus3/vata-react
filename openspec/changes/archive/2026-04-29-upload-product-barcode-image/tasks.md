## Tasks

- [x] Update product typing
  - Add optional fields to `types/product.ts` for `barcodeImageUrl` and `barcodeImageName`.

- [x] Add barcode image selection UI
  - Extend the add-product modal component to include a barcode image upload button.
  - Allow the user to choose an image from the device or capture a new photo.
  - Show a preview of the selected barcode image.

- [x] Create Firebase Storage upload helper
  - Add a storage helper in `services/storage.ts` or extend `services/firestore.ts`.
  - Support uploading an image blob/file and returning a download URL.

- [x] Update product creation flow
  - Modify `services/product.ts` so `createProduct` can save `barcodeImageUrl` and `barcodeImageName`.
  - If a barcode image is selected, upload it before saving the Firestore product document.

- [x] Update product list rendering
  - Update `components/home/ProductListItem.tsx` to render barcode image preview when `barcodeImageUrl` exists.
  - Keep typed barcode/EAN text visible as fallback information.

- [x] Validate and test
  - Verify product creation works with and without barcode image upload.
  - Confirm the storage screen refreshes after adding a new product.
  - Test that image uploads are stored in Firebase Storage and referenced correctly in Firestore.
