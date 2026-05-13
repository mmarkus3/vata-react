## Context

`app/product/[id].tsx` currently renders product metadata and edit fields in a long continuous sequence. As product detail functionality expanded (category, pricing, nutrition, image management, barcode handling), this layout became harder to scan and slower to edit.

## Goals / Non-Goals

**Goals:**
- Group product detail content into accordion sections `basic`, `price`, and `nutritions`.
- Apply grouping consistently in view mode and edit mode.
- Preserve existing form validation, update payload, and save/delete/reset lifecycle behavior.
- Ensure collapsed sections do not hide critical validation feedback.

**Non-Goals:**
- Changing product data schema or update service contract.
- Redesigning image and barcode subflows beyond section placement.
- Replacing react-hook-form or existing validation rules.

## Decisions

1. Use section grouping as presentation-only state around existing fields.
Rationale: improve UX without disturbing data contracts.
Alternative: split page into separate tabs/routes. Rejected due to navigation overhead.

2. Keep `basic` expanded by default; `price` and `nutritions` collapsible.
Rationale: immediately exposes core product info and most frequent edits.
Alternative: all collapsed by default. Rejected because it slows common workflows.

3. Expand section containing first validation error after submit attempt.
Rationale: avoids hidden validation issues when users submit with collapsed sections.
Alternative: rely only on global error text. Rejected due to weaker field discoverability.

4. Reuse shared/parallel accordion behavior patterns from add-product modal where practical.
Rationale: consistency between create and edit product experiences.
Alternative: custom one-off detail-page toggles. Rejected due to maintenance drift.

## Risks / Trade-offs

- [Risk] Additional UI state for accordion open/close can introduce edge bugs between view/edit transitions. -> Mitigation: reset section open-state predictably on mode changes and product reload.
- [Risk] Validation UX regressions if error section expansion is incomplete. -> Mitigation: map fields to sections and auto-open the first errored section.
- [Risk] More nested layout could impact readability on small screens. -> Mitigation: keep concise section headers and preserve existing field spacing and typography.
