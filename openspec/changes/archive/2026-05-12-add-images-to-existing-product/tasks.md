## 1. Product Image Update Flow

- [x] 1.1 Extend the existing product detail/edit UI to allow selecting one or more images for an existing product.
- [x] 1.2 Add i18next translation keys for new image-update actions, labels, and feedback messages.
- [x] 1.3 Ensure updated image selection UI follows existing modal/button styling and accessibility patterns.

## 2. Persistence and Data Sync

- [x] 2.1 Update product update logic to merge and persist newly added image references for existing products.
- [x] 2.2 Ensure product fetch/read pathways return updated image arrays after save.
- [x] 2.3 Confirm storage product list consumers use refreshed image data after an existing product is edited.

## 3. Validation and Regression Coverage

- [x] 3.1 Add or update tests for adding images to an existing product and successful save behavior.
- [x] 3.2 Add or update tests ensuring edited product image data is available in subsequent reads/list rendering.
- [ ] 3.3 Perform manual verification of success and failure paths for image upload/save in the product edit flow.
