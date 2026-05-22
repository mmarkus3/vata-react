## Context

The orders tab already supports status segments and oldest-first sorting, but users currently must manually scan long lists to find specific orders. Since needed search fields (order id and customer metadata) are already present in fetched order objects, a lightweight client-side filter can improve navigation without backend API changes.

## Goals / Non-Goals

**Goals:**
- Provide a single text filter input on orders list page.
- Match by order id, customer full name, and customer email.
- Keep filtering compatible with existing segment filter and oldest-first sorting.
- Preserve current loading/error/empty behaviors and add clear empty-filtered behavior.

**Non-Goals:**
- Server-side search endpoints.
- Advanced search syntax (field-specific operators).
- Fuzzy ranking/scoring.

## Decisions

- Implement filter as normalized case-insensitive substring match.
Rationale: simple, predictable, and sufficient for id/name/email lookup.
Alternative considered: exact-match only; rejected due to lower usability.

- Apply filters in order: segment filter first, then text filter.
Rationale: aligns with current mental model where segment defines working set.
Alternative considered: global text filter then segment; rejected as less intuitive.

- Keep existing oldest-first ordering after filtering.
Rationale: preserves current behavior and reduces surprise.

- Build filtering logic in reusable list-state helper for testability.
Rationale: keeps UI component lean and enables deterministic unit tests.

## Risks / Trade-offs

- [Risk] Large local lists may incur filter cost on each keystroke.
  → Mitigation: use memoization in UI and simple linear matching; revisit debouncing only if needed.

- [Risk] Missing customer fields can cause runtime edge cases.
  → Mitigation: normalize nullable fields to empty strings in matcher helper.

- [Risk] Ambiguity around full name formatting.
  → Mitigation: match against combined `firstname + lastname` and individual names when available.

## Migration Plan

1. Add filter state and text input in orders list UI.
2. Extend orders list state helper to include text-based filtering.
3. Add/adjust i18n strings for filter UI and filtered empty state if needed.
4. Add/update tests for id, name, email matching and segment interaction.
5. Run targeted frontend tests.

Rollback strategy:
- Remove filter input and revert helper logic changes; no data migration required.

## Open Questions

- Should filter query persist when user switches away and back to Orders tab?
- Should we also match customer phone in a follow-up change?
