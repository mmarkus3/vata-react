## Context

The product detail page currently displays barcode information but does not support editing a previously uploaded barcode image. The existing model stores barcode image URLs in the `barcode` field, and the detail page has edit mode for text fields but no image replacement flow.

## Goals / Non-Goals

**Goals:**
- Enable users to remove an existing barcode image from the product detail screen.
- Enable users to upload a new barcode image and replace the current one.
- Keep the `barcode` field as the single source of truth for barcode image URLs.
- Provide clear UI feedback for image preview, upload progress, and removal.

**Non-Goals:**
- Introduce a separate `barcodeImageUrl` field or dual barcode storage fields.
- Rework product creation flows beyond the detail screen image edit experience.
- Add barcode scanning or OCR functionality.

## Decisions

- Use a dedicated image upload control in the product detail edit screen instead of overloading the text barcode input.
- Treat `product.barcode` as either a plain barcode string or a barcode image URL. When an image URL is present, render the image preview and allow removal.
- On image replacement, upload the new image to Firebase Storage and then update `product.barcode` with the new URL in Firestore.
- If the user removes the current barcode image, clear the URL from `product.barcode` and preserve any plain barcode text separately where applicable.
- Reuse existing storage upload and delete service patterns from the product creation flow to minimize duplicate logic.

## Risks / Trade-offs

- [Risk] The `barcode` field now stores both text and image URLs.
  → Mitigation: Document the contract clearly in code comments and normalize URL detection when rendering.
- [Risk] Removing an image may delete the wrong Firebase Storage object if the URL is malformed.
  → Mitigation: Validate the URL before issuing a delete request and handle failures gracefully.
- [Risk] Upload latency can make the edit save feel slow.
  → Mitigation: Show an explicit progress/loading state and disable save until the upload completes.
