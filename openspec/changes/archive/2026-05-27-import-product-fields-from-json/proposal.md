## Why

Product detail data can already be supplied in a structured trade-item JSON payload, but users currently need to re-enter the available information manually. Importing the payload into product detail editing reduces transcription work while preserving the existing product storage model.

## What Changes

- Add a JSON import action to the product detail edit experience using the `ProductImport` contract in `types/productImport.ts`.
- Parse a selected JSON file and populate only matching existing product edit fields when source values are available.
- Map supported source values into existing fields such as product name, EAN, product images, country of origin, localized ingredients and descriptions, and nutritional values.
- Leave form values unchanged when the imported payload does not provide a usable matching value.
- Surface invalid or unsupported JSON file errors through localized user feedback.
- Explicitly do not add imported packaging, classification, allergen, measurement, marketing, tax, lifespan, or other JSON-only properties to `types/product.ts`.

## Capabilities

### New Capabilities
- `product-json-detail-import`: Select and import typed trade-item JSON data into the existing product detail edit form.

### Modified Capabilities
- `react-hook-form-product-detail`: Product edit form state can be populated from available imported product values before the existing save workflow is used.

## Impact

- Affected code: `app/product/[id].tsx`, `app/product/productDetailForm.ts`, a focused JSON import mapping/parser utility, translations, and frontend tests.
- Types: uses `types/productImport.ts` as input; `types/product.ts` remains unchanged.
- UI/runtime: file selection support is needed for the Expo/React Native product detail screen.
- Persistence: continues through the existing product update workflow; no Firestore schema expansion or backend API changes are introduced.
