## 1. Service Transaction Implementation

- [x] 1.1 Add a transactional fullfilment creation method in `services/fullfliment.ts`
- [x] 1.2 Read all referenced product docs in transaction and validate available stock
- [x] 1.3 Decrement each product amount and create fullfilment within same transaction
- [x] 1.4 Add explicit error mapping for insufficient stock vs generic failures

## 2. UI Submission and Error Handling

- [x] 2.1 Update `AddFullfilmentModal` submit flow to use transactional service method
- [x] 2.2 Show user-friendly insufficient stock error message in modal
- [x] 2.3 Preserve entered form data when submission fails
- [x] 2.4 Keep loading/disabled states correct during submission and retry

## 3. Data Refresh and Consistency

- [x] 3.1 Ensure client detail fullfilments refresh after successful creation
- [x] 3.2 Ensure storage product amounts reflect decremented values after creation
- [x] 3.3 Verify no partial update is visible when transaction fails

## 4. Testing and Verification

- [x] 4.1 Add/extend tests for successful fullfilment creation with stock decrement
- [x] 4.2 Add/extend tests for insufficient inventory rejection with no writes
- [x] 4.3 Add/extend tests for transaction failure handling and user feedback
- [x] 4.4 Run lint/tests and document any manual verification steps
