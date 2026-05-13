## Why

Users can currently assign categories only from product create/edit screens, which makes category-centric workflows slow. Category detail should support adding products directly so teams can build category contents from one place.

## What Changes

- Add "add product to category" capability on category detail page.
- Provide a product selection flow from category detail to choose products and assign the current category.
- Update selected products using existing product update behavior.
- Refresh category product listing after assignment.
- Add loading/success/error feedback for assignment operations.

## Capabilities

### New Capabilities
- `category-product-assignment-from-category-page`: Assign products to a category directly from category detail view.

### Modified Capabilities
- `category-detail-page`: Category detail page behavior expands with product-assignment action and flow.
- `product-category-assignment`: Category assignment behavior expands beyond product create/edit to include category-page initiated assignment.

## Impact

- Affected code: `app/category/[id].tsx`, category-related UI components, and potentially new selection modal/component for products.
- Services: reuse `getProductsByCompany` + `updateProduct` for assignment operations.
- UX: category detail receives additional call-to-action and assignment feedback states.
- Testing: add/update tests for assignment flow, mutation handling, and list refresh behavior.
