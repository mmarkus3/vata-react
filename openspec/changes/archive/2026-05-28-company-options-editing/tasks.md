## 1. Data Access

- [x] 1.1 Create a frontend options service for fetching `options/{companyId}`.
- [x] 1.2 Create an update helper that writes editable option fields with merge semantics and strips `undefined` values.
- [x] 1.3 Add focused tests for options fetching, saving, numeric mapping, and preserving `currencyRate`.

## 2. Navigation

- [x] 2.1 Add a new overflow menu item and localized navigation label for company options.
- [x] 2.2 Add a new `app/(home)` route for the company options page.

## 3. Options Page

- [x] 3.1 Load options using the signed-in user's `profile.company` and render loading, missing-company, and error states.
- [x] 3.2 Render editable fields for delivery price, free-delivery threshold, VAT, notification email, and VismaPay credentials.
- [x] 3.3 Exclude `currencyRate` from the form and visible page content.
- [x] 3.4 Validate numeric fields before saving and show localized validation errors.
- [x] 3.5 Save valid edits to Firestore and show localized success or failure feedback.

## 4. Verification

- [x] 4.1 Add or update Jest coverage for the options page behavior and service payloads.
- [x] 4.2 Run targeted Jest tests for options service/page and navigation configuration.
- [x] 4.3 Run TypeScript or lint checks relevant to the touched files and note any unrelated existing failures.
