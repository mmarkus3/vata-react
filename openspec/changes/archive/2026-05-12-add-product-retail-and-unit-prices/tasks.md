## 1. Product Form Updates

- [x] 1.1 Add retail price (vähittäismyyntihinta) and unit price (kilohinta) inputs to new product creation UI.
- [x] 1.2 Add retail price and unit price inputs to existing product edit UI.
- [x] 1.3 Add i18next translation keys for new field labels, placeholders, and validation/error messages.

## 2. Persistence and Data Mapping

- [x] 2.1 Update create product payload mapping to persist optional `retailPrice` and `unitPrice` numeric values.
- [x] 2.2 Update existing product save/update mapping to persist edited `retailPrice` and `unitPrice` values.
- [x] 2.3 Ensure product read pathways return `retailPrice` and `unitPrice` for detail and storage list consumers.

## 3. Validation and Verification

- [x] 3.1 Add or update tests for create flow saving retail/unit prices (including optional empty values).
- [x] 3.2 Add or update tests for edit flow saving retail/unit prices and subsequent reads.
- [ ] 3.3 Perform manual verification in app for create/edit success paths and numeric validation behavior.
