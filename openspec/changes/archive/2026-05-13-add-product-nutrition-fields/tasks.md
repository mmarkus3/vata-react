## 1. Product Form Fields

- [x] 1.1 Add nutrition inputs to new product form for `energyJoule`, `energyCalory`, `fat`, `saturatedFat`, `carbohydrate`, `saturatedCarbohydrate`, `protein`, `salt`, and `fiber`.
- [x] 1.2 Add the same nutrition inputs to existing product edit form.
- [x] 1.3 Add i18next labels/placeholders/validation messages for all new nutrition fields.

## 2. Persistence and Data Mapping

- [x] 2.1 Update create-product payload mapping to save optional nutrition fields as numeric values when provided.
- [x] 2.2 Update edit/save payload mapping to persist nutrition field updates for existing products.
- [x] 2.3 Ensure product read pathways return nutrition fields for detail and storage list consumers.

## 3. Validation and Verification

- [x] 3.1 Add or update tests for create flow nutrition field persistence (including partial/empty optional values).
- [x] 3.2 Add or update tests for edit flow nutrition updates and subsequent read behavior.
- [ ] 3.3 Perform manual verification for create/edit UI and numeric validation of nutrition fields.
