## Why

Ingredients and descriptions are currently mixed into the basic product fields, which makes the main product form harder to scan and edit. Moving this multilingual content into its own accordion section improves form clarity in both create and edit flows.

## What Changes

- Add a dedicated `additionalInfo` accordion section (`Lisätiedot`) for product ingredients and product descriptions.
- Move `ingredients_fi/sv/en` and `description_fi/sv/en` fields from the `basic` section into `additionalInfo` in create and edit forms.
- Keep `countryOfOrigin` in `basic`.
- Ensure validation-error-driven accordion expansion opens `additionalInfo` when those fields contain errors.
- Add localization keys for the new section title in create and edit contexts.

## Capabilities

### New Capabilities
- `product-additional-info-accordion-section`: Organize multilingual ingredients and descriptions under a dedicated accordion section.

### Modified Capabilities
- `react-hook-form-product-modal`: Create form accordion behavior changes to include a new section and updated field grouping.
- `react-hook-form-product-detail`: Product detail form accordion behavior changes to include a new section and updated field grouping.

## Impact

- Affected code: `components/home/AddProductModal.tsx`, `components/home/addProductAccordion.ts`, `app/product/[id].tsx`, `app/product/productDetailAccordion.ts`.
- Localization: `i18n/*/translation.json` section label additions.
- Testing: add/adjust tests for accordion field-section mapping and error expansion behavior for `additionalInfo`.
