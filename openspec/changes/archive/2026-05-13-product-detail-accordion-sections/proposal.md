## Why

The product detail page currently presents viewing and editing fields in a long linear layout, which makes scanning and focused edits harder, especially with nutrition and pricing data mixed in. Grouping product detail fields into accordion sections now will improve readability and editing efficiency without changing core update behavior.

## What Changes

- Group product detail display and edit fields into accordion sections: `basic`, `price`, and `nutritions`.
- Apply the grouped layout consistently in both read mode and edit mode on `app/product/[id].tsx`.
- Preserve existing react-hook-form validation, payload mapping, and save lifecycle behavior.
- Define section expand/collapse defaults and behavior when validation errors occur in collapsed sections.
- Localize section labels and helper cues via i18next keys.

## Capabilities

### New Capabilities
- `product-detail-accordion-layout`: Accordion-based grouping of product detail content for view/edit workflows.

### Modified Capabilities
- `react-hook-form-product-detail`: Product detail form requirements expand to include grouped accordion presentation while preserving declarative validation and submit behavior.

## Impact

- Affected code: `app/product/[id].tsx`, potential shared accordion helpers/components, and translation files.
- UX: clearer navigation of product data sections and reduced cognitive load in detail/edit flow.
- Testing: add/update tests for section rendering/toggling and unchanged edit/save payload behavior.
