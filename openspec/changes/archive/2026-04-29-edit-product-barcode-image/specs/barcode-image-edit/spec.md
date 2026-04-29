## ADDED Requirements

### Requirement: Editable barcode image management
The product detail page SHALL allow users to remove an existing barcode image and replace it with a new image upload.

#### Scenario: Remove existing barcode image
- **WHEN** the product has a barcode image URL and the user opens edit mode
- **THEN** the UI displays a remove image action
- **AND** the user can confirm removal
- **AND** the product is saved without the image URL in `product.barcode`

#### Scenario: Replace barcode image with a new upload
- **WHEN** the product has an existing barcode image URL and the user selects a new image
- **THEN** the UI previews the new image before save
- **AND** the existing image is replaced with the newly uploaded image URL after save

#### Scenario: Add barcode image when none exists
- **WHEN** the product does not have a barcode image URL and the user uploads a barcode image
- **THEN** the image is uploaded and `product.barcode` is updated with the new URL

### Requirement: Barcode image upload validation and feedback
The product detail edit flow SHALL display upload progress, success confirmation, and user-friendly error messages if upload fails.

#### Scenario: Upload failure
- **WHEN** image upload fails due to network or storage error
- **THEN** the UI displays an error message
- **AND** the product is not saved with an invalid URL
