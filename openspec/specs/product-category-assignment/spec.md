# product-category-assignment Specification

## Purpose
TBD - created by archiving change product-category-selection-create-update. Update Purpose after archive.
## Requirements
### Requirement: User can assign category during product create and edit
The system SHALL allow users to select an optional product category when creating a new product and when editing an existing product.

#### Scenario: Select category while creating product
- **WHEN** a user opens product create flow and chooses a category option
- **THEN** the selected category is included in the product create payload

#### Scenario: Change category while editing product
- **WHEN** a user opens product edit flow and saves with a different selected category
- **THEN** the updated category is included in the product update payload

### Requirement: Category selector handles stale saved values
The system SHALL preserve usability when an existing product category value does not exist in the current category list.

#### Scenario: Edit product with unknown saved category
- **WHEN** a product has a saved category value that is not present in current category options
- **THEN** the edit form still displays the saved value as a selectable fallback option
- **AND** the user can keep it or replace it with a listed category

