## Context

The backend order API is consumed by external clients and can return full customer PII. For order lookup scenarios, clients often need recognition rather than complete raw values. Masking customer fields at API boundary reduces unnecessary data exposure.

## Goals / Non-Goals

**Goals:**
- Mask all `order.customer` fields in backend order-by-id response.
- Keep masking deterministic and easy to test.
- Avoid mutating stored order data; masking is response-time only.

**Non-Goals:**
- Masking for other endpoints unless explicitly requested.
- Encryption/tokenization changes in database.
- Role-based partial unmasking.

## Decisions

- Implement masking in backend order-by-id response mapping layer.
Rationale: central and endpoint-specific, avoids touching stored documents.

- Use deterministic prefix-preserving mask.
Rationale: allows user recognition while hiding full value.
Proposed rule: preserve first 3 characters for strings longer than 3, append `***`; for shorter strings, return `***`.

- Mask every customer field string (firstname, lastname, email, phone, address fields).
Rationale: requirement says all customer fields.

## Risks / Trade-offs

- [Risk] Clients depending on raw customer data may break.
  → Mitigation: treat as intentional API contract change and update tests/docs.

- [Risk] Ambiguity for very short values.
  → Mitigation: define explicit short-value rule in tests.

## Migration Plan

1. Add masking helper for customer fields.
2. Apply helper in order-by-id response mapping.
3. Add/update tests for masking across all customer fields and null/empty handling.
4. Deploy backend.

Rollback strategy:
- Remove masking at response layer and restore previous raw-field response.

## Open Questions

- Should the same masking be applied to order list endpoint responses as follow-up?
