## ADDED Requirements

### Requirement: User can add images to an existing product
The system SHALL allow a user to add one or more images to a product that already exists and save those images as part of the product update flow.

#### Scenario: Add image to existing product
- **WHEN** a user opens an existing product and selects new image files
- **THEN** the system includes the new images in the pending product update

#### Scenario: Save product with newly added images
- **WHEN** a user confirms saving an existing product with newly selected images
- **THEN** the system persists the updated product with the newly added image references

### Requirement: Added product images are available in subsequent reads
The system SHALL return newly added product image references in later product fetches used by product detail and list views.

#### Scenario: Re-open edited product
- **WHEN** an existing product is fetched after images were added and saved
- **THEN** the fetched product includes the newly added image references
