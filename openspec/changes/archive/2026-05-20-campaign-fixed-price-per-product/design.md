## Context

Campaign create/edit currently treats fixed-price discount as a single value for the whole campaign. For selected-products targeting, users need explicit fixed price input per product line. Existing campaign form logic already maps selected products and discount settings, so extending line-level pricing is a natural evolution.

## Goals / Non-Goals

**Goals:**
- Enable per-product fixed price inputs when discount type is fixed.
- Persist per-product fixed values in campaign payload for create and edit.
- Validate each selected product has a valid fixed price in fixed mode.

**Non-Goals:**
- Changing percentage discount behavior.
- Redesigning unrelated campaign UI sections.
- Backend contract redesign beyond line-level fixed price support already represented in campaign product lines.

## Decisions

- Extend campaign form state with map/object keyed by product ID for fixed price values.
- In fixed discount mode with selected products targeting, require valid fixed value per selected product.
- Reuse existing create/edit modal product list UI by adding per-row fixed price input controls only when needed.
- Keep all-products/category modes compatible by deriving line prices for products included in payload.

## Risks / Trade-offs

- [Validation complexity] Missing per-line values can block save more often -> clear inline error messages per product.
- [State synchronization] Product selection changes can leave stale price entries -> prune stale IDs when deselected.
- [Backward compatibility] Existing campaigns may not have per-line values -> retain fallback handling during edit prefill.
