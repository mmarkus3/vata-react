## 1. Update Accordion Section Models

- [x] 1.1 Add `additionalInfo` to create-form accordion section key/type definitions and section open-state defaults where needed.
- [x] 1.2 Add `additionalInfo` to product-detail accordion section key/type definitions and section open-state defaults where needed.
- [x] 1.3 Move `ingredients_*` and `description_*` field mappings from `basic` to `additionalInfo` in both accordion mapping modules while keeping `countryOfOrigin` in `basic`.

## 2. Move UI Fields Into New Section

- [x] 2.1 Update `components/home/AddProductModal.tsx` to render a new `additionalInfo` accordion section labeled via i18n and move ingredients/description inputs into it.
- [x] 2.2 Update `app/product/[id].tsx` to render a new `additionalInfo` accordion section labeled via i18n and move ingredients/description read/edit fields into it.
- [x] 2.3 Ensure collapsed-section error expansion opens `additionalInfo` when one of its fields has validation errors.

## 3. Localization

- [x] 3.1 Add `addProduct.sections.additionalInfo` and `productDetail.sections.additionalInfo` keys in Finnish translations.
- [x] 3.2 Add `addProduct.sections.additionalInfo` and `productDetail.sections.additionalInfo` keys in English translations.

## 4. Verification

- [x] 4.1 Add or update tests for section-field mapping helpers to verify additional-info fields map to `additionalInfo` in create and detail forms.
- [x] 4.2 Run targeted tests for modified form and accordion helper modules and resolve regressions.
