## 1. Extend Form Models

- [x] 1.1 Add `countryOfOrigin`, `ingredients_fi/sv/en`, and `description_fi/sv/en` to `AddProductFormValues` and its defaults in `components/home/addProductForm.ts`.
- [x] 1.2 Add `countryOfOrigin`, `ingredients_fi/sv/en`, and `description_fi/sv/en` to `ProductDetailFormValues`, defaults, and `toProductDetailFormValues` mapping in `app/product/productDetailForm.ts`.

## 2. Update Create and Edit UI Flows

- [x] 2.1 Add inputs/controllers for origin, multilingual ingredients, and multilingual descriptions in `components/home/AddProductModal.tsx` under the basic accordion section.
- [x] 2.2 Add inputs/controllers for origin, multilingual ingredients, and multilingual descriptions in `app/product/[id].tsx` under the basic accordion section for edit mode.
- [x] 2.3 Add or update i18next translation keys for labels/placeholders/errors for new fields used by both create and product detail screens.

## 3. Persist and Validate New Fields

- [x] 3.1 Extend create payload mapping in `AddProductModal` to include new fields with trimmed values and Firestore-safe null conversion.
- [x] 3.2 Extend update payload mapping in product detail save flow to include new fields with trimmed values and Firestore-safe null conversion.
- [x] 3.3 Confirm field error ordering/accordion expansion still reveals validation issues in the basic section when relevant.

## 4. Verify Behavior

- [x] 4.1 Update/add unit tests for add-product form helpers to cover defaults and payload transformation of new multilingual fields.
- [x] 4.2 Update/add unit tests for product-detail form helpers to cover preload mapping and save transformation of new multilingual fields.
- [x] 4.3 Run targeted Jest tests for add-product and product-detail form modules and resolve regressions.
