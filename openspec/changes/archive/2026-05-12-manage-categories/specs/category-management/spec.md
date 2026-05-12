## ADDED Requirements

### Requirement: View Categories List
The system SHALL display a list of all categories in a dedicated Categories page accessible from the home navigation. Categories SHALL be displayed in a scrollable list with their name and description.

#### Scenario: Load categories on page mount
- **WHEN** user navigates to the Categories page
- **THEN** system fetches all categories from Firestore and displays them in a list
- **AND** a loading indicator is shown while fetching

#### Scenario: List displays empty state
- **WHEN** user navigates to Categories page and no categories exist
- **THEN** system displays an empty state message with a call-to-action to create a category

#### Scenario: Real-time category updates
- **WHEN** categories are modified in Firestore
- **THEN** list automatically updates without requiring page refresh

#### Scenario: Handle fetch errors
- **WHEN** Firestore fetch fails
- **THEN** system displays an error message with a retry button

### Requirement: Create Category
The system SHALL allow users to create new categories with a name and description through a modal form. Form validation SHALL ensure name is not empty and not duplicated.

#### Scenario: Open create category modal
- **WHEN** user taps the "Add Category" button on the Categories page
- **THEN** system displays a modal form with empty name and description fields

#### Scenario: Successful category creation
- **WHEN** user fills in the name and description fields and taps "Create"
- **THEN** system validates inputs (name not empty, no duplicates)
- **AND** creates the category in Firestore
- **AND** closes the modal
- **AND** adds the new category to the list

#### Scenario: Validation error on empty name
- **WHEN** user attempts to submit the form without a name
- **THEN** system displays an error message "Category name is required"
- **AND** prevents form submission

#### Scenario: Validation error on duplicate name
- **WHEN** user attempts to create a category with a name that already exists
- **THEN** system displays an error message "Category name already exists"
- **AND** prevents form submission

#### Scenario: Handle creation failure
- **WHEN** Firestore save fails
- **THEN** system displays an error message and keeps the modal open with user inputs preserved

### Requirement: Edit Category
The system SHALL allow users to edit existing categories' name and description through a modal form. Changes SHALL be validated before saving to Firestore.

#### Scenario: Open edit category modal
- **WHEN** user taps on a category in the list or taps an edit button on a list item
- **THEN** system displays a modal form pre-filled with the category's current name and description

#### Scenario: Successful category edit
- **WHEN** user modifies the name or description and taps "Save"
- **THEN** system validates the new values (name not empty, no duplicates with other categories)
- **AND** updates the category in Firestore
- **AND** closes the modal
- **AND** refreshes the category in the list

#### Scenario: Validation error on empty name during edit
- **WHEN** user clears the name field and attempts to save
- **THEN** system displays an error message "Category name is required"
- **AND** prevents form submission

#### Scenario: Validation error on duplicate name during edit
- **WHEN** user changes the name to an existing category name
- **THEN** system displays an error message "Category name already exists"
- **AND** prevents form submission
- **AND** allows editing the same category name if it matches the current value

#### Scenario: Discard changes on modal close
- **WHEN** user closes the edit modal without saving
- **THEN** system discards any unsaved changes
- **AND** original category data remains unchanged

#### Scenario: Handle update failure
- **WHEN** Firestore update fails
- **THEN** system displays an error message and keeps the modal open with user inputs preserved

### Requirement: Delete Category
The system SHALL allow users to delete categories with a confirmation prompt to prevent accidental deletion.

#### Scenario: Delete category with confirmation
- **WHEN** user taps the delete button on a category item
- **THEN** system displays a confirmation dialog asking "Are you sure you want to delete this category?"

#### Scenario: Confirm deletion
- **WHEN** user taps "Delete" on the confirmation dialog
- **THEN** system removes the category from Firestore
- **AND** removes the category from the list

#### Scenario: Cancel deletion
- **WHEN** user taps "Cancel" on the confirmation dialog
- **THEN** system closes the dialog without deleting the category

#### Scenario: Handle deletion failure
- **WHEN** Firestore delete fails
- **THEN** system displays an error message
- **AND** category remains in the list

### Requirement: Navigation Integration
The system SHALL make the Categories page accessible from the home navigation menu alongside existing pages like Clients, Reports, and Settings.

#### Scenario: Navigation link appears in home layout
- **WHEN** user is on any home page (Clients, Reports, Settings, etc.)
- **THEN** system displays a "Categories" navigation item in the navigation menu
- **AND** is visually distinguishable and accessible

#### Scenario: Navigate to categories page
- **WHEN** user taps the "Categories" navigation item
- **THEN** system navigates to the Categories page
- **AND** displays the list of categories

### Requirement: User Feedback and Loading States
The system SHALL provide clear visual feedback for all operations including loading states, success confirmations, and error messages.

#### Scenario: Show loading indicator during fetch
- **WHEN** user navigates to Categories page and data is being loaded
- **THEN** system displays a loading spinner or skeleton
- **AND** blocks user interaction until data loads or error occurs

#### Scenario: Show loading state during save
- **WHEN** user submits the create or edit form
- **THEN** system shows a loading indicator on the submit button
- **AND** disables form inputs while saving

#### Scenario: Success feedback on create
- **WHEN** category is successfully created
- **THEN** system displays a success notification (toast/alert)
- **AND** automatically closes the modal after brief delay
