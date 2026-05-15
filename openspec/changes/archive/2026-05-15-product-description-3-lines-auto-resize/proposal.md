## Why

Editing product descriptions currently uses a fixed-height input that can feel cramped for multi-line content and inconsistent when text length grows. Defining a clear default height with automatic expansion improves readability and reduces friction while updating product details.

## What Changes

- Update product description editing requirements so description fields show three lines by default.
- Add behavior requirements so description inputs automatically grow in height as users type additional lines.
- Preserve existing product metadata persistence behavior and validation while improving multilingual description editing usability.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `product-origin-and-multilingual-content`: Change product detail description editing requirements to use a 3-line default height and automatic vertical resize during input.

## Impact

- Affected code likely includes product detail edit components and shared multiline input wrappers used for `description_*` fields.
- No backend, API, or Firestore schema changes are expected.
- UI behavior change should be validated in mobile and web form rendering contexts.
