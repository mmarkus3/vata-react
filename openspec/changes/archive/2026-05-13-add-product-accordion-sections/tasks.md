## 1. Accordion Structure

- [x] 1.1 Add accordion section state and render structure for `basic`, `price`, and `nutritions` groups in `AddProductModal`.
- [x] 1.2 Place required create fields in the default-expanded `basic` section and move optional price/nutrition fields into their respective sections.
- [x] 1.3 Ensure expand/collapse interactions do not reset or lose react-hook-form field values.

## 2. Validation and UX Behavior

- [x] 2.1 Preserve existing validation and submit payload behavior while fields are rendered inside accordion content.
- [x] 2.2 Define behavior for validation errors in collapsed sections (expand relevant section or provide clear top-level guidance).
- [x] 2.3 Keep image/category/barcode areas integrated with the reorganized layout without changing their functional behavior.

## 3. Localization and Regression Coverage

- [x] 3.1 Add localized section titles and any helper text needed for accordion UX.
- [x] 3.2 Add or update tests verifying section rendering/toggling and unchanged create submission payload behavior.
- [x] 3.3 Verify manually that create flow remains stable for required-only input and full optional input paths.
