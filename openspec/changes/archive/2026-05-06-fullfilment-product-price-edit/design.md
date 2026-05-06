## Context

Fullfilment creation currently allows selecting product and amount, but line-item price is opaque and fixed to the product master value at the time of submission. Users need visibility into the active price and the ability to adjust price for the current fullfilment without changing global product master data.

## Goals / Non-Goals

**Goals:**
- Show current product price during product selection in add fullfilment modal.
- Allow per-line price editing before adding product to fullfilment list.
- Persist the chosen line price in fullfilment payload for downstream reporting.
- Keep stock and amount validation behaviors unchanged.

**Non-Goals:**
- Editing the global product master price.
- Currency conversion or taxation calculations.
- Historical retroactive repricing of existing fullfilments.

## Decisions

### Per-line editable price in modal
- **Decision:** Add numeric price input next to amount during add-product step.
- **Rationale:** Keeps price context local to current line and familiar to users.
- **Alternative considered:** Separate edit step after line added; rejected due to extra friction.

### Default from product master price
- **Decision:** Prefill price input from selected product's current price.
- **Rationale:** Preserves current behavior as default while enabling override.
- **Alternative considered:** Blank price field requiring manual entry; rejected for usability.

### Persist line price in existing fullfilment product structure
- **Decision:** Continue using `fullfilment.products[].product.price` as authoritative stored line price.
- **Rationale:** Compatible with existing data model and reporting readers.
- **Alternative considered:** Additional separate line-price field; rejected to avoid schema duplication.

## Risks / Trade-offs

- **Invalid price input (negative/empty/non-numeric)** -> Mitigated with strict form validation and error messaging.
- **Confusion between line price and product master price** -> Mitigated with label text clarifying this affects current fullfilment line.
- **Formatting inconsistencies** -> Mitigated by normalizing numeric value before save.

## Migration Plan

1. Add price input state and validation in `AddFullfilmentModal`.
2. Prefill price from selected product and include edited value in line-item payload.
3. Keep existing creation service contract, passing updated line-item prices.
4. Add tests for default price, edited price persistence, and invalid-price validation.

## Open Questions

- Should price precision be restricted to two decimals in input/UI formatting?
