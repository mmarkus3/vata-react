## ADDED Requirements

### Requirement: Order-by-id returns masked customer fields
The backend SHALL return `order.customer` fields in masked format for order-by-id responses.

#### Scenario: Customer fields are masked in response
- **WHEN** order-by-id endpoint returns an order containing customer data
- **THEN** all string fields under `customer` are masked before response is sent

#### Scenario: Missing customer object is handled safely
- **WHEN** order-by-id endpoint returns an order without customer object
- **THEN** response is returned without masking errors

### Requirement: Masking uses deterministic prefix-plus-stars rule
The backend SHALL apply deterministic masking where values are transformed to a visible prefix with star suffix (example: `Markus` -> `Mar***`).

#### Scenario: Standard-length value is masked
- **WHEN** customer field value length is greater than 3
- **THEN** response keeps first 3 characters and masks remaining portion with `***`

#### Scenario: Short value is masked
- **WHEN** customer field value length is 3 or fewer characters
- **THEN** response returns `***` for that field
