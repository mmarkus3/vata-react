# firestore-write-sanitization Specification

## Purpose
TBD - created by archiving change firestore-undefined-to-null. Update Purpose after archive.
## Requirements
### Requirement: Firestore write payloads MUST not contain undefined values
The system MUST normalize Firestore write payloads by converting all `undefined` values to `null` before executing create or update writes.

#### Scenario: Create write with undefined optional fields
- **WHEN** application calls Firestore create helper with payload containing `undefined` fields
- **THEN** the helper writes the payload with those fields converted to `null`
- **AND** the write does not fail due to unsupported `undefined` values

#### Scenario: Update write with nested undefined values
- **WHEN** application calls Firestore update helper with nested objects or arrays containing `undefined`
- **THEN** all nested `undefined` values are converted to `null` prior to write

### Requirement: Non-undefined data remains unchanged during normalization
The system MUST preserve non-undefined values in write payloads while performing normalization.

#### Scenario: Mixed payload normalization
- **WHEN** a write payload contains strings, numbers, booleans, nulls, arrays, objects, and undefined fields
- **THEN** only `undefined` fields are converted to `null`
- **AND** all other values are written unchanged

