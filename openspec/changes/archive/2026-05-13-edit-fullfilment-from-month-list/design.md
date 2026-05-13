## Context

Client detail monthly fullfilment list currently supports viewing only. Users cannot open a fullfilment entry to correct date, line items, amounts, or prices. Since fullfilment creation already updates storage atomically, edit behavior must keep inventory consistency when amounts change.

## Goals / Non-Goals

**Goals:**
- Allow opening a fullfilment from monthly list (`activeTab === 0`).
- Provide edit UI for fullfilment fields (date, lines, amount, price).
- Persist edits and refresh monthly/product views afterward.
- Keep storage inventory consistent when edited product amounts change.

**Non-Goals:**
- Bulk editing multiple fullfilments.
- Editing fullfilments from product-tab list in this change.
- Rebuilding reporting pages.

## Decisions

### Row-level action opens edit modal
- **Decision:** Make monthly fullfilment rows tappable and open an edit modal prefilled with selected fullfilment values.
- **Rationale:** Minimal navigation overhead and consistent with existing modal workflows.
- **Alternative considered:** Dedicated fullfilment detail route; rejected for extra routing complexity.

### Reuse add-modal patterns for form behavior
- **Decision:** Reuse field validation patterns from AddFullfilmentModal for date, product, amount, and price.
- **Rationale:** Reduces divergence and keeps UX predictable.
- **Alternative considered:** Separate form model with custom rules; rejected due to duplication risk.

### Edit persistence adjusts inventory delta atomically
- **Decision:** Update fullfilment and inventory in one transaction by applying per-product delta between original and edited quantities.
- **Rationale:** Prevents inventory drift and partial update states.
- **Alternative considered:** Revert original then recreate edited fullfilment; rejected due to unnecessary writes and race risk.

## Risks / Trade-offs

- **Complex delta logic across added/removed/changed lines** -> Mitigated by normalizing line maps per product and unit tests.
- **Concurrent updates while editing** -> Mitigated with transactional reads and write retries.
- **User confusion if save fails for stock reasons** -> Mitigated with clear insufficient-stock errors.

## Migration Plan

1. Add service method for fullfilment update with atomic inventory adjustment.
2. Add UI action on monthly rows to open edit modal.
3. Implement edit modal with prefilled data and validations.
4. Refresh grouped fullfilment data after successful update.
5. Add tests for delta behavior and error handling.

## Open Questions

- Should edited fullfilments record metadata (updatedAt/updatedBy) in this change, or defer to later audit enhancement?
