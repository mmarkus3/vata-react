## ADDED Requirements

### Requirement: Product Image Support
The system SHALL allow users to attach multiple images to a product via upload or URL when creating or editing a product.

#### Scenario: Display product image gallery
- **WHEN** a product has one or more image URLs in `images`
- **THEN** the product detail page displays those images in a gallery

#### Scenario: Add image by link during create
- **WHEN** user adds an image URL in the Add Product modal
- **THEN** the URL is added to the product preview list
- **AND** the product is saved with that URL in `images`

#### Scenario: Upload image during create
- **WHEN** user selects an image file from their device/computer in the Add Product modal
- **THEN** the image is previewed
- **AND** the uploaded image is saved to Firebase Storage
- **AND** the resulting URL is persisted in `images`

#### Scenario: Add image by link during edit
- **WHEN** user enters a valid image URL in the product detail edit mode
- **THEN** the URL is added to the current product images list
- **AND** persists in Firestore on save

#### Scenario: Upload image during edit
- **WHEN** user selects a new image file while editing a product
- **THEN** the image is uploaded to Firebase Storage and added to `images`

#### Scenario: Remove product image in edit mode
- **WHEN** user removes an image from the current product images list in edit mode
- **THEN** the image is removed from the `images` array on save

#### Scenario: Handle invalid image link
- **WHEN** user enters a malformed image URL
- **THEN** the system displays a validation error and prevents submission

### Requirement: Persistence of product images
The system SHALL store product image URLs in the existing `images: string[]` field of the `Product` model in Firestore.

#### Scenario: Product document stores images array
- **WHEN** a product is created or updated with images
- **THEN** Firestore document includes `images: [url1, url2, ...]`

#### Scenario: Load product images safely
- **WHEN** a product has no `images` field in Firestore
- **THEN** the product detail page treats images as an empty list and renders without errors

### Requirement: Keep barcode image support unchanged
The system SHALL preserve current barcode field and barcode image upload behavior separately from the new product image feature.
