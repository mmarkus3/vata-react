## Why

Order-by-id responses expose full customer details, which increases privacy risk when data is viewed in backend-integrated contexts. Returning masked customer fields reduces sensitive data exposure while preserving enough information for identification.

## What Changes

- Update backend order-by-id API response to mask all customer fields before returning them.
- Apply masking consistently for name, email, phone, and address fields under `order.customer`.
- Use deterministic masking format where first characters stay visible and the remainder is replaced with `*` (example: `Markus` -> `Mar***`).

## Capabilities

### New Capabilities
- `order-by-id-customer-masking`: Privacy-preserving masking of customer fields in backend order-by-id responses.

### Modified Capabilities
- None.

## Impact

- Backend order retrieval logic in `functions/src/orders` (service/controller path for order-by-id).
- API contract for consumers of order-by-id endpoint.
- Backend tests for masking behavior and response shape.
