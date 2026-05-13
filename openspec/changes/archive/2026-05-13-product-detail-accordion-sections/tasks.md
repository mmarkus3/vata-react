## 1. Detail Accordion Structure

- [x] 1.1 Add accordion section state and render structure for `basic`, `price`, and `nutritions` in `app/product/[id].tsx`.
- [x] 1.2 Place core product fields in default-expanded `basic` section and move pricing/nutrition fields into corresponding sections.
- [x] 1.3 Ensure section toggle interactions preserve view values and in-progress edit form values.

## 2. Edit Behavior and Validation

- [x] 2.1 Keep existing react-hook-form bindings and update payload behavior while fields are rendered inside accordion sections.
- [x] 2.2 Implement validation-error section expansion so collapsed errored fields become visible after save attempt.
- [x] 2.3 Preserve existing barcode/product image and save/reset/delete behavior after layout reorganization.

## 3. Localization and Regression Coverage

- [x] 3.1 Add localized accordion section labels/helper text for product detail page.
- [x] 3.2 Add or update tests for accordion section rendering/toggling and unchanged edit submission behavior.
- [x] 3.3 Verify view-mode and edit-mode flows remain stable for basic-only edits and full pricing/nutrition edits.
