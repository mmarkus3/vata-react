## Why

Using category name as product category reference is fragile because renames break associations and duplicate names can cause ambiguity. Switching product category reference to category id provides stable relations and safer category lifecycle changes.

## What Changes

- Store product category references as category id instead of category name.
- Update create/edit product category selection to persist selected category id.
- Update category detail product listing and category-page assignment flow to use category id matching.
- Introduce compatibility/migration strategy for existing products that still store category names.
- Update category option rendering so labels still show category names while values use ids.
- **BREAKING**: Product documents and category-related queries/filters change from name-based to id-based references.

## Capabilities

### New Capabilities
- `product-category-id-migration`: Migrate and/or safely handle legacy name-based category references during transition to id-based references.

### Modified Capabilities
- `product-category-assignment`: Assignment semantics and persistence switch from category name values to category id values.
- `category-detail-page`: Category detail product retrieval and assignment actions switch to category id relations.

## Impact

- Affected code: `types/product.ts`, product form mappers, category option utilities, `services/product.ts` category queries, category detail assignment flow.
- UX: no visible labeling change; category names remain display text.
- Testing: update/add tests for id-based assignment, query filtering, and migration compatibility.
