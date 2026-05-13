## Why

The add-product modal currently presents many fields in one long scrolling block, which makes the form harder to scan and increases input mistakes. Grouping fields into clear accordion sections now will improve form usability without changing core product creation behavior.

## What Changes

- Group add-product form fields into accordion sections: `basic`, `price`, and `nutritions`.
- Keep existing validation and submit behavior while reorganizing field presentation.
- Define default expand/collapse behavior and section labeling for consistent UX.
- Preserve image and barcode blocks outside or after accordion groups while maintaining current workflows.
- Ensure accordion section titles and helper texts are localized via i18next.

## Capabilities

### New Capabilities
- `add-product-form-accordion-layout`: Structured accordion section UX for product creation form grouping and navigation.

### Modified Capabilities
- `react-hook-form-product-modal`: Add-product form requirements expand to include grouped accordion presentation for core field sets.

## Impact

- Affected code: `components/home/AddProductModal.tsx`, potentially shared accordion UI primitives and translation keys.
- UX: improved readability and faster navigation across large field sets in create flow.
- Testing: update/add tests for section rendering, expand/collapse behavior, and unchanged submit payload behavior.
