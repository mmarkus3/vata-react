## Why

Product API responses currently do not consistently expose the effective campaign discount price for active auto-applied campaigns. Clients need a reliable backend-calculated `discountPrice` so product pricing is correct and consistent across channels.

## What Changes

- Add backend API logic to return `discountPrice` for a product when there is at least one active campaign without code that includes that product.
- Support both campaign discount types (`fixed`, `percentage`) and compute final price using `retailPrice`.
- If multiple active auto campaigns apply to the same product, return the lowest resulting `discountPrice`.
- Ensure percentage campaign calculation is based on product `retailPrice`.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `campaign-create`: Clarify pricing behavior contract so percentage discounts are interpreted against product `retailPrice` for API effective pricing.
- `campaign-edit`: Clarify that edits affecting active auto campaigns influence API-calculated effective `discountPrice`.
- `product-price-extensions`: Extend product API response behavior to include campaign-derived effective `discountPrice` from active auto campaigns and lowest-price selection across multiple matches.

## Impact

- Backend product read/list endpoints and shared product mapping logic.
- Campaign lookup/filtering in backend for active date range and code-less campaigns.
- Product response model fields used by frontend/webshop.
- Backend tests covering percentage/fixed discount price computation and multi-campaign minimum selection.
