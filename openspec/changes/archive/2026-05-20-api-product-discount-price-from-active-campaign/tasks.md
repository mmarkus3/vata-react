## 1. Campaign Price Resolution in Product API

- [x] 1.1 Identify backend product response mapping path(s) and campaign data fetch used for product list/detail APIs.
- [x] 1.2 Implement active no-code campaign filtering by time window and product membership.
- [x] 1.3 Compute campaign candidate prices per product for both fixed and percentage types (percentage based on `retailPrice`).
- [x] 1.4 Resolve `discountPrice` as the lowest valid candidate across multiple applicable campaigns.

## 2. API Response Integration and Safety

- [x] 2.1 Attach computed `discountPrice` to product API response model while preserving existing fields.
- [x] 2.2 Handle invalid/missing pricing or campaign line values safely by skipping invalid candidates.
- [x] 2.3 Ensure coded campaigns are excluded from auto campaign `discountPrice` resolution.

## 3. Verification

- [x] 3.1 Add/update backend unit tests for fixed campaign price, percentage-from-retailPrice, and multi-campaign lowest-price selection.
- [x] 3.2 Add/update tests for inactive campaign exclusion and coded campaign exclusion.
- [x] 3.3 Run targeted backend test suite for products/campaign pricing and resolve regressions.
