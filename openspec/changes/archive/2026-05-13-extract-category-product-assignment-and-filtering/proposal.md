## Why

Category detail currently mixes product-assignment UI, assignment state, and category page responsibilities in one large file, which slows iteration and testing. Splitting assignment into its own module and adding product filtering improves maintainability and makes assignment workflows faster for users.

## What Changes

- Move add-product-to-category UI and assignment behavior from `app/category/[id].tsx` into dedicated category-assignment component/module files.
- Add product filtering in assignment flow so users can quickly find products by search term.
- Keep existing assignment behavior (multi-select, submit, success/error feedback, loading handling) intact.
- Keep category detail page focused on category metadata, assigned products list, and high-level actions.

## Capabilities

### New Capabilities
- `category-product-assignment-ui-modularization`: Modular assignment component architecture for category page product assignment.

### Modified Capabilities
- `category-product-assignment-from-category-page`: Assignment flow now includes filtering and componentized structure while preserving existing outcomes.
- `category-detail-page`: Category detail page interaction contract changes to delegate assignment flow to a dedicated component.

## Impact

- Affected code: `app/category/[id].tsx`, new category assignment component files under `app/category/` or `components/category/`.
- State management: assignment modal/filter/selection logic moves out of page-level component.
- Testing: add/update unit tests for filtering logic and componentized assignment states.
