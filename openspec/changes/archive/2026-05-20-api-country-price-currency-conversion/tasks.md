## 1. Country-Aware Currency Resolution

- [x] 1.1 Identify product list/detail response mapping fields that must be currency-converted.
- [x] 1.2 Read company country in product API flow and define EUR default behavior.
- [x] 1.3 Integrate currency `getRate` fetch for SE and reuse fetched rate across products in a response.

## 2. Product Price Conversion Integration

- [x] 2.1 Apply EUR->SEK conversion to exposed price fields when company country is `SE`.
- [x] 2.2 Keep non-SE responses in EUR without conversion.
- [x] 2.3 Add safe fallback to EUR values if rate lookup fails/unavailable.

## 3. Verification

- [x] 3.1 Add/update backend tests for EUR default and SE conversion behavior.
- [x] 3.2 Add/update tests for SE fallback when `getRate` fails.
- [x] 3.3 Run targeted backend product service tests and resolve regressions.
