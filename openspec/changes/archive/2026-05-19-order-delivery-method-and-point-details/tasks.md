## 1. API and Data Helpers

- [x] 1.1 Add service helper to fetch selected point info using `${EXPO_PUBLIC_FIREBASE_API}/orders/company/:company/point/:id`.
- [x] 1.2 Add/extend types for selected point response fields used in UI.
- [x] 1.3 Handle missing base URL, company, or point ID with safe non-crashing fallback behavior.

## 2. Order Detail UI

- [x] 2.1 Render delivery method section/value on order detail page.
- [x] 2.2 Fetch selected point information after order load when identifiers are available.
- [x] 2.3 Render selected point info section with loading/success/fallback states.

## 3. Localization and Verification

- [x] 3.1 Add/update i18n keys for delivery method label, selected point label, and fallback/error texts.
- [x] 3.2 Add/update unit tests for point-fetch helper and order-detail state handling.
- [x] 3.3 Run targeted order-detail tests and resolve regressions.
