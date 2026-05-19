## Context

Campaign management now supports listing and creation, but there is no dedicated detail page to inspect one campaign comprehensively. Users need a single view to inspect discount mode, validity period, targeting mode, and selected products to confirm behavior.

## Goals / Non-Goals

**Goals:**
- Provide route/screen for campaign details.
- Allow opening detail from campaign list row tap.
- Display campaign metadata in structured sections with clear fallback states.

**Non-Goals:**
- Editing campaign in this change.
- Campaign deletion workflow.
- New business logic for campaign application.

## Decisions

- Add a dedicated campaign detail route (e.g., `/campaign/[id]`) similar to order detail pattern.
- Add campaign service fetch-by-id helper where needed.
- Reuse existing list/detail state patterns (loading/error/empty) for consistency.
- Keep detail rendering read-only with localized labels.

## Risks / Trade-offs

- [Data completeness] Older campaigns may miss newer fields -> provide robust fallback rendering.
- [Navigation regressions] Row tap behavior may conflict with existing interactions -> keep route helper explicit and tested.
- [Type variance] Campaign dates and targeting fields can vary by version -> normalize before display.
