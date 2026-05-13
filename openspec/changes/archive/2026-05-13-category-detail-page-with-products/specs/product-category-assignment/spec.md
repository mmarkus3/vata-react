## MODIFIED Requirements

### Requirement: User can assign category during product create and edit
The system SHALL allow users to select an optional product category when creating a new product and when editing an existing product, and categories with assigned products SHALL be inspectable from a category detail page.

#### Scenario: Select category while creating product
- **WHEN** a user opens product create flow and chooses a category option
- **THEN** the selected category is included in the product create payload

#### Scenario: Change category while editing product
- **WHEN** a user opens product edit flow and saves with a different selected category
- **THEN** the updated category is included in the product update payload

#### Scenario: Inspect products assigned to a category
- **WHEN** a user opens a category detail page
- **THEN** the system lists products assigned to that category so assignments are reviewable

### Requirement: Category selector handles stale saved values
The system SHALL preserve usability when an existing product category value does not exist in the current category list.

#### Scenario: Edit product with unknown saved category
- **WHEN** a product has a saved category value that is not present in current category options
- **THEN** the category selector still renders the saved value as a selectable fallback
- **AND** the user can keep it or replace it with a listed category
