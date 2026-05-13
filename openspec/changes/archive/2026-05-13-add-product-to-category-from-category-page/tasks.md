## 1. Category Detail Assignment UI

- [x] 1.1 Add an "add products to category" action to `app/category/[id].tsx`.
- [x] 1.2 Build a product selection UI (modal/section) in category detail for choosing candidate products.
- [x] 1.3 Show loading/empty/error states for assignment candidates and mutation progress.

## 2. Product Assignment Logic

- [x] 2.1 Load candidate products for current company and filter out products already in the active category.
- [x] 2.2 Implement assignment submit flow using `updateProduct(productId, { category: currentCategoryName })` for selected products.
- [x] 2.3 Refresh assigned products list and close/reset selection state after successful assignment.

## 3. Reliability and UX

- [x] 3.1 Prevent duplicate submissions while assignment is in progress.
- [x] 3.2 Surface clear success and failure feedback for assignment operations.
- [x] 3.3 Keep existing category edit/delete and product navigation behaviors intact.

## 4. Verification

- [x] 4.1 Add/update tests for candidate filtering and assignment state logic.
- [x] 4.2 Add/update tests for assignment success/error behavior in category detail flow.
- [x] 4.3 Run targeted category/product test suites and resolve regressions.
