## Why

Firestore rejects `undefined` values in document writes, and current create/update flows still construct payloads that may include optional fields as `undefined`. Centralizing a write-time normalization rule to convert `undefined` to `null` will prevent runtime write failures and keep persistence behavior consistent.

## What Changes

- Add a shared Firestore write sanitization step that recursively converts `undefined` values to `null` before `addDoc`, `setDoc`, and `updateDoc` calls.
- Apply the sanitization in shared Firestore service helpers so all feature flows inherit the behavior.
- Preserve existing field-level semantics where optional values are intentionally absent from UI logic, while ensuring persisted payloads remain Firestore-safe.
- Add regression tests for nested objects/arrays and mixed scalar values.

## Capabilities

### New Capabilities
- `firestore-write-sanitization`: Firestore write payload normalization that converts unsupported `undefined` values to `null`.

### Modified Capabilities
- None.

## Impact

- Affected code: `services/firestore.ts` and tests for write helper behavior.
- Reliability: reduces Firestore runtime errors caused by accidental `undefined` in payloads.
- Data shape: optional values that were previously `undefined` at write time are stored as `null`.
