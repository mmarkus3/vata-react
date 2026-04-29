## Why

Users currently cannot add new inventory items directly from the storage page, which makes maintaining product data inconvenient and error-prone. Adding product creation to storage will let users manage stock in one place and reduce the need for external tooling.

## What Changes

- Add a user interface for creating new products on the storage page.
- Introduce a product creation form with fields for name, amount, price, and barcode/EAN.
- Get company association from signed in user.
- Barcode is an image that user uploads. Save the image to firebase storage.
- Validate input on the client side and save new products to Firestore.
- Update the storage product list to refresh automatically after a product is added.

## Capabilities

### New Capabilities
- `storage-product-creation`: Enable users to add new products from the storage screen with typed product fields and validation.

### Modified Capabilities
- (none)

## Impact

- Updates to `app/home/index.tsx` to add creation UI and refresh behavior.
- New form component(s) under `components/home/` for adding products.
- `services/product.ts` may need a new create method for Firestore writes.
- `types/product.ts` will be used for product validation and typing.
- This change affects storage UI and product persistence but does not require backend API changes beyond Firestore document writes.
