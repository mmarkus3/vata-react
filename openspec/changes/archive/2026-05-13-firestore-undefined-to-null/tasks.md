## 1. Firestore Write Sanitization

- [x] 1.1 Add a shared deep normalization utility in `services/firestore.ts` that converts `undefined` values to `null`.
- [x] 1.2 Apply normalization in `saveItem`, `saveAsItem`, and `updateItem` before writing to Firestore.
- [x] 1.3 Ensure normalization preserves non-undefined scalar/object/array values unchanged.

## 2. Regression Coverage

- [x] 2.1 Add unit tests for normalization with nested objects and arrays containing `undefined`.
- [x] 2.2 Add tests confirming create/update helper payloads are Firestore-safe after normalization.
- [x] 2.3 Verify existing product/category/client write flows continue working with normalized `null` values.
