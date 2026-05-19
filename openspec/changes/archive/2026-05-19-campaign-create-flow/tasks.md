## 1. Campaign Creation Data Model and Validation

- [x] 1.1 Extend campaign types/models for targeting mode, optional code mode, and discount type payload.
- [x] 1.2 Implement campaign-create form state + validation rules (date range, targeting selection, discount value).
- [x] 1.3 Ensure campaign payload always derives `company` from authenticated user profile.

## 2. Campaign Creation UI and Save Flow

- [x] 2.1 Build campaign creation UI with fields: name, optional code, start/end, targeting mode, discount type/value.
- [x] 2.2 Implement product/category selection UX for targeting modes (selected products, all products, category).
- [x] 2.3 Save valid campaign to backend/firestore and show success/error feedback.

## 3. Campaign Behavior Contract

- [x] 3.1 Persist explicit mode metadata for code-based vs auto-applied behavior.
- [x] 3.2 Ensure discount configuration is mutually consistent with selected discount type.
- [x] 3.3 Update campaigns list row summary to expose essential mode metadata (e.g., code usage) if available.

## 4. Localization and Verification

- [x] 4.1 Add/update i18n keys for campaign create form labels, targeting options, and validation messages.
- [x] 4.2 Add/update unit tests for campaign create validation and targeting/discount mode logic.
- [x] 4.3 Run targeted tests for campaign creation and campaigns list logic and resolve regressions.
