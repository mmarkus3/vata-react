## 1. Product Description Input Behavior

- [x] 1.1 Locate product detail edit form fields for `description_fi`, `description_sv`, and `description_en` and identify the shared multiline input path.
- [x] 1.2 Configure description edit inputs to render with a default 3-line height baseline (`numberOfLines` or equivalent).
- [x] 1.3 Implement auto-resize logic based on content-size changes so description inputs expand vertically beyond the 3-line baseline.

## 2. Safety and UX Validation

- [x] 2.1 Ensure the new input sizing behavior is scoped to description edit fields and does not alter unrelated multiline inputs.
- [x] 2.2 Verify existing multilingual metadata save/update behavior remains unchanged and Firestore-safe (no `undefined` values introduced).
- [x] 2.3 Validate behavior on mobile and web form views to confirm three-line default visibility and automatic growth for longer content.

## 3. Regression Tests

- [x] 3.1 Add or update component/form tests to cover default 3-line description input rendering.
- [x] 3.2 Add or update tests to cover auto-resize behavior when description content exceeds three lines.
