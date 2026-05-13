## 1. Update Category Reference Semantics

- [x] 1.1 Update product domain/type and inline documentation so `category` is treated as category id value.
- [x] 1.2 Update category option builders and form mappings (create/edit) to persist selected category id while displaying category names.
- [x] 1.3 Update category-page assignment flow to write category id when assigning products.

## 2. Update Category-Based Retrieval

- [x] 2.1 Update product service category filters and category detail retrieval logic to match products by category id.
- [x] 2.2 Ensure category detail assigned-product listing and empty/error states still behave correctly under id-based matching.
- [x] 2.3 Keep stale/unknown category fallback behavior in selectors usable during transition.

## 3. Migration and Compatibility

- [x] 3.1 Implement compatibility handling for legacy name-based product category values.
- [x] 3.2 Add migration utility/process to convert resolvable legacy product category names to ids.
- [x] 3.3 Add safe handling/reporting for unresolvable legacy values.

## 4. Verification

- [x] 4.1 Add/update tests for id-based category option values, assignment payloads, and category filters.
- [x] 4.2 Add/update tests for migration/compatibility mapping behavior.
- [x] 4.3 Run targeted category/product form, service, and category-page test suites and resolve regressions.
