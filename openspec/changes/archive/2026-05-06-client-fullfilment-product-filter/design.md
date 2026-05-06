## Context

The fullfilment creation modal currently loads and displays all company products. Users often need only products already used with the current client, so browsing the full list slows down selection. We need a simple product source switch in the modal while preserving existing validation and submission logic.

## Goals / Non-Goals

**Goals:**
- Add a source selector for product list scope in add fullfilment modal.
- Default source to products already present in this client's historical fullfilments.
- Allow switching to all company products without closing or resetting the modal.
- Keep fullfilment submission, stock deduction, and validation behavior unchanged.

**Non-Goals:**
- Reworking the entire product picker UI.
- Adding fuzzy search or pagination for products.
- Changing fullfilment grouping/report views.

## Decisions

### Source selector options and default
- **Decision:** Provide two options: `Kaupan tuotteet` and `Kaikki tuotteet`; default to `Kaupan tuotteet`.
- **Rationale:** Reduces noise for common use while retaining flexibility.
- **Alternative considered:** Default to all products; rejected because it does not solve the selection-noise problem.

### Derive client product set from existing fullfilments
- **Decision:** Build the filtered set from product IDs present in the client's historical fullfilments.
- **Rationale:** Matches user mental model of "products already used for this client".
- **Alternative considered:** Separate persisted client-product mapping; rejected due to extra model complexity.

### Keep in-memory filtering after loading base data
- **Decision:** Load full product set and client fullfilments once on modal open, then apply local filter when source changes.
- **Rationale:** Fast toggle response and simpler state handling.
- **Alternative considered:** Refetch on each toggle; rejected due to unnecessary network calls.

## Risks / Trade-offs

- **Client has no historical fullfilments** -> Mitigated with empty-state helper text and easy switch to `Kaikki tuotteet`.
- **Large product lists** -> Mitigated by defaulting to reduced list (`Kaupan tuotteet`).
- **State bugs when switching source with selected product** -> Mitigated by clearing invalid selected product when it no longer exists in current filtered list.

## Migration Plan

1. Add source-selector state and filtered product derivation in modal.
2. Load client fullfilments along with company products on modal open.
3. Update UI to show selector and context-aware empty states.
4. Add/extend tests for default source, switching behavior, and fallback flow.

## Open Questions

- Should source preference persist per user/session? (Current proposal: no persistence, always default to `Kaupan tuotteet`.)
