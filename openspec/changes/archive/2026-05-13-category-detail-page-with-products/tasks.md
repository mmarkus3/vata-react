## 1. Category Detail Route and Data Loading

- [x] 1.1 Add a category detail route (e.g. `app/category/[id].tsx`) with loading/error/not-found states.
- [x] 1.2 Add category detail data retrieval by id and category-filtered product retrieval for the current company.
- [x] 1.3 Render category name, description, and category product list with empty-state handling.

## 2. Move Category Actions to Detail Page

- [x] 2.1 Move edit-category trigger from categories list screen to category detail page.
- [x] 2.2 Move delete-category trigger and confirmation flow from categories list screen to category detail page.
- [x] 2.3 After successful delete, navigate user back to categories list.

## 3. Categories List Navigation Refactor

- [x] 3.1 Update `CategoryListItem` to act as a navigation entry to category detail.
- [x] 3.2 Remove inline edit/delete controls from list item UI and related props from list/list screen.
- [x] 3.3 Keep add-category action and list states working in categories home screen.

## 4. Validation and Tests

- [x] 4.1 Add/update tests for category list item behavior and removed inline actions.
- [x] 4.2 Add/update tests for category detail states (loading, empty products, success, delete navigation).
- [x] 4.3 Run targeted test suites for categories and related product-category flows and resolve regressions.
