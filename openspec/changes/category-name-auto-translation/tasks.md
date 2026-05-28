## 1. Data Model

- [x] 1.1 Add optional `name_sv` and `name_en` fields to frontend and backend category interfaces.
- [x] 1.2 Confirm existing category create/update payloads do not send `undefined` translation fields.

## 2. Translation Trigger

- [x] 2.1 Create a backend category translation trigger module using `onDocumentWritten` for `/categories/{categoryId}`.
- [x] 2.2 Add pure helpers to decide whether a category document needs translation on create/update/delete.
- [x] 2.3 Use `@google-cloud/translate` to translate category `name` to Swedish and English.
- [x] 2.4 Write `name_sv` and `name_en` back only when translated values are missing or changed.
- [x] 2.5 Log translation failures without throwing from the trigger handler.
- [x] 2.6 Export the trigger from `functions/src/index.ts`.

## 3. Tests

- [x] 3.1 Add backend unit tests for create, name update, unchanged name, missing translations, deletion, and matching translation scenarios.
- [x] 3.2 Add tests that mock the translation client and verify Swedish/English target language mapping.
- [x] 3.3 Add tests that verify translation failures are logged and do not reject the trigger handler.

## 4. Verification

- [x] 4.1 Run targeted backend Jest tests for the category translation trigger.
- [x] 4.2 Run relevant TypeScript or lint checks for touched backend files and document any unrelated existing failures.
- [x] 4.3 Validate the OpenSpec change after implementation.
