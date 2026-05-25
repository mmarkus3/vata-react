## 1. Backend masking implementation

- [x] 1.1 Add customer field masking helper for order-by-id responses.
- [x] 1.2 Apply masking to all customer string fields in backend order-by-id response mapping.
- [x] 1.3 Ensure masking is response-time only and does not alter stored Firestore data.

## 2. Verification

- [x] 2.1 Add/update backend tests for field-by-field masking (`firstname`, `lastname`, `email`, `phone`, address fields).
- [x] 2.2 Add/update tests for short values, empty values, and missing customer object.
- [x] 2.3 Run targeted backend tests for orders controller/service behavior.
