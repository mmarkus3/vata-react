## 1. Modal Component Extraction

- [x] 1.1 Create a dedicated campaign create modal component file and move existing modal UI there.
- [x] 1.2 Define typed props/callbacks for modal visibility, form values, updates, save, and close behavior.
- [x] 1.3 Refactor `app/(home)/campaigns.tsx` to use extracted modal component with unchanged business behavior.

## 2. Datepicker Integration

- [x] 2.1 Replace start/end text fields with datepicker controls in campaign create modal.
- [x] 2.2 Normalize picker output to campaign form validation/payload format.
- [x] 2.3 Keep date-range validation and error messaging consistent after datepicker integration.

## 3. Verification

- [x] 3.1 Add/update unit tests for extracted modal interaction callbacks.
- [x] 3.2 Add/update tests for date selection and resulting form value updates.
- [x] 3.3 Run targeted campaign create/list tests and resolve regressions.
