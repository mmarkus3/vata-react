## 1. Product model and data mapping

- [x] 1.1 Add `showInWebshop` to product domain/types with boolean runtime semantics.
- [x] 1.2 Update Firestore-to-product mapping to default missing `showInWebshop` to `false` for legacy documents.
- [x] 1.3 Update product create/update payload builders to always write a concrete boolean `showInWebshop` (never `undefined`).

## 2. Product form integration

- [x] 2.1 Add `showInWebshop` to product create/edit form default values and controlled form schema.
- [x] 2.2 Add a localized UI control for webshop visibility in the product form, following existing modal/button/form styling conventions.
- [x] 2.3 Ensure submit transformation includes `showInWebshop` in the saved payload for both create and edit flows.

## 3. Validation and regression safety

- [x] 3.1 Add or update Jest tests for mapping defaults, payload generation, and form submit transformation with `showInWebshop`.
- [x] 3.2 Verify unchanged behavior for existing product fields and save lifecycle after adding `showInWebshop`.
- [x] 3.3 Run targeted test suites and fix any regressions introduced by the new field.
