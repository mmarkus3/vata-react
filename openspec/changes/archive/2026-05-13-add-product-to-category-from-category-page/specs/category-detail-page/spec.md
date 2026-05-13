## MODIFIED Requirements

### Requirement: Category detail page shows category metadata and products
The system SHALL provide a category detail page that displays category name, description, products assigned to the category, and an action to add products into the current category.

#### Scenario: Open category detail from categories list
- **WHEN** a user taps a category item in the categories list
- **THEN** the system navigates to that category's detail page

#### Scenario: Category detail shows assigned products
- **WHEN** a category detail page loads successfully
- **THEN** the page shows the category name and description
- **AND** lists products whose category matches the selected category

#### Scenario: Category with no products shows empty state
- **WHEN** a category has no assigned products
- **THEN** the category detail page shows an explicit empty-products state

#### Scenario: Category detail handles loading and errors
- **WHEN** category or product data is loading or fails to load
- **THEN** the page shows appropriate loading or error feedback

#### Scenario: Add products to category from category detail
- **WHEN** a user starts the add-products flow on category detail, selects products, and confirms
- **THEN** selected products are updated to use the current category
- **AND** the category product list reflects the new assignments

### Requirement: Category edit and delete actions live in category detail page
The system SHALL expose category edit and delete actions in the category detail page and remove these actions from the categories list screen.

#### Scenario: Edit category from detail page
- **WHEN** a user chooses edit on category detail and saves valid changes
- **THEN** the category is updated and the page reflects the updated values

#### Scenario: Delete category from detail page
- **WHEN** a user confirms delete on category detail
- **THEN** the category is deleted
- **AND** the user is navigated back to the categories list screen

#### Scenario: Categories list remains browse-focused
- **WHEN** a user views categories list screen
- **THEN** each list item provides navigation to detail
- **AND** list items do not present inline edit/delete controls
