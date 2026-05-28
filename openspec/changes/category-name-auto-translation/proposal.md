## Why

Categories need Swedish and English names for multilingual product/category experiences, but users currently enter only the default category name. Automatically translating category names on create/update keeps category data multilingual without adding manual translation work to the UI.

## What Changes

- Add backend Firestore trigger behavior for category documents using `onDocumentWritten`.
- When a category is created or its `name` changes, translate `name` to Swedish and English.
- Persist translations to `name_sv` and `name_en` on the same category document.
- Skip translation when the category name is unchanged and translations are already present.
- Avoid trigger loops by only writing when translated fields need to change.
- Use `@google-cloud/translate` from Firebase Functions to perform translations.

## Capabilities

### New Capabilities
- `category-name-auto-translation`: Covers backend-managed Swedish and English category-name translations for category create/update events.

### Modified Capabilities

## Impact

- Backend Firebase Functions under `functions/src`.
- Category Firestore documents gain optional backend-managed fields `name_sv` and `name_en`.
- Category TypeScript interfaces may need optional translation fields.
- Backend tests for trigger decision logic, translation mapping, and loop prevention.
- No frontend form changes and no backend API contract changes unless category API responses later choose to expose translated names.
