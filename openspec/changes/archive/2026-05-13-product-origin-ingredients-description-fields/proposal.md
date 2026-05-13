## Why

Product metadata currently lacks complete localized origin, ingredient, and description inputs in create/edit flows, limiting data quality for multilingual use cases. Users should be able to enter country of origin and multilingual product content at creation time and update it later in product detail.

## What Changes

- Add `countryOfOrigin` input to product create and product edit flows.
- Add multilingual ingredients inputs: `ingredients_fi`, `ingredients_sv`, `ingredients_en` in create/edit.
- Add multilingual description inputs: `description_fi`, `description_sv`, `description_en` in create/edit.
- Include all new fields in create and update payload mapping with Firestore-safe null handling.
- Add localized field labels/placeholders/help text for all new inputs.

## Capabilities

### New Capabilities
- `product-origin-and-multilingual-content`: Manage country of origin, multilingual ingredients, and multilingual descriptions in product forms.

### Modified Capabilities
- `react-hook-form-product-modal`: Product create form requirements expand to include origin and multilingual ingredients/description fields.
- `react-hook-form-product-detail`: Product edit form requirements expand to include origin and multilingual ingredients/description fields.

## Impact

- Affected code: `components/home/AddProductModal.tsx`, `app/product/[id].tsx`, form helpers, translations, and product service payload mapping.
- Data model usage: existing optional fields in `Product` are actively used in create/update flows.
- Testing: update/add Jest coverage for payload mapping and form value initialization for new multilingual fields.
