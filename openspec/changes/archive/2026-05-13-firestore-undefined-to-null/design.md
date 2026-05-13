## Context

Shared Firestore helper functions (`saveItem`, `saveAsItem`, `updateItem`) currently pass payloads directly to Firestore SDK methods. Several app flows build partial objects with optional fields that can become `undefined`; Firestore rejects those writes and throws runtime errors.

## Goals / Non-Goals

**Goals:**
- Ensure all Firestore writes normalize `undefined` to `null` before write execution.
- Implement this behavior once in shared Firestore helpers so callers do not need custom guards.
- Preserve current caller APIs while improving write safety.

**Non-Goals:**
- Refactoring all feature-level payload builders to avoid `undefined` manually.
- Changing Firestore read conversion semantics.
- Introducing schema-level validation or migration tooling.

## Decisions

1. Add a shared deep-normalization utility in Firestore service layer.
Rationale: centralizes behavior and ensures consistent treatment across all writes.
Alternative: patch each feature write call site. Rejected because it is error-prone and hard to maintain.

2. Apply normalization to `addDoc`, `setDoc`, and `updateDoc` payloads.
Rationale: all write paths must be safe regardless of which helper callers use.
Alternative: only sanitize `saveItem`. Rejected because `updateItem` and `saveAsItem` would still fail.

3. Convert only `undefined` values to `null`; preserve all other primitives/objects/arrays.
Rationale: minimal behavioral change while complying with Firestore constraints.
Alternative: remove keys with `undefined`. Rejected because key removal semantics differ from explicit empty value in partial updates.

## Risks / Trade-offs

- [Risk] Persisting `null` may alter downstream UI expectations where `undefined` was assumed. -> Mitigation: keep read-time parsing resilient to both `null` and `undefined` and add regression tests.
- [Risk] Deep normalization adds small runtime overhead on large payloads. -> Mitigation: keep implementation iterative/efficient and scoped to write-time operations.
- [Risk] Complex nested custom objects might be transformed unexpectedly. -> Mitigation: include unit tests for nested objects and arrays with mixed values.
