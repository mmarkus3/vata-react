## Why

Category management currently mixes list browsing and destructive/edit actions in one screen, and users cannot inspect which products belong to a category. A dedicated category detail page improves discoverability, clarity, and safer category maintenance.

## What Changes

- Create a category detail page that shows category name, description, and products assigned to that category.
- Make category list items navigate to the category detail page.
- Move category edit and delete actions from the category list screen to the new category detail page.
- Keep category create flow in the categories list screen.
- Add loading/empty/error states for category-detail product listing.

## Capabilities

### New Capabilities
- `category-detail-page`: View category details and its products, and manage category edit/delete from the detail page.

### Modified Capabilities
- `product-category-assignment`: Category assignment behavior expands with a discoverable category-centric view where assigned products are listed by category.

## Impact

- Affected code: `app/(home)/categories.tsx`, `components/categories/CategoryList.tsx`, `components/categories/CategoryListItem.tsx`, new category detail route (e.g. `app/category/[id].tsx`), and category/product service queries.
- Navigation: category list gains drill-down navigation to category detail.
- Data access: need category-by-id retrieval and products-by-company-and-category query usage in detail page.
- Testing: add/update component and service tests for navigation/action placement and category-detail product states.
