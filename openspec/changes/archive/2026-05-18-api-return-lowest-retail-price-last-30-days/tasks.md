## 1. API Response Contract

- [x] 1.1 Identify backend product read paths (single item and list) that form API response payloads.
- [x] 1.2 Ensure product response mapping includes `lowestRetailPriceLast30Days` for all backend/API product reads.
- [x] 1.3 Ensure fallback behavior returns `lowestRetailPriceLast30Days: null` instead of omitting the field when not computable.

## 2. Type and Integration Updates

- [x] 2.1 Update product response typing/interfaces to include `lowestRetailPriceLast30Days` in API-facing product models.
- [x] 2.2 Verify integration points consuming backend product data remain compatible with nullable `lowestRetailPriceLast30Days`.

## 3. Verification

- [x] 3.1 Add/update tests validating `lowestRetailPriceLast30Days` is present in product detail response mapping.
- [x] 3.2 Add/update tests validating `lowestRetailPriceLast30Days` is present in product list response mapping.
- [x] 3.3 Add/update tests validating null fallback for products without sufficient pricing history.
