## Context

Orders tab already fetches company orders and renders list rows. Current list state helper handles loading/error/empty but does not segment by status. Status values used in domain include `placed`, `paid`, and `sent` (plus others in broader flow). Requirement focuses on operational statuses only and deterministic oldest-first ordering.

## Goals / Non-Goals

**Goals:**
- Provide segmented controls for statuses `placed`, `paid`, `sent`.
- Filter list to active segment status.
- Sort displayed orders by created date ascending (oldest first).
- Keep existing row navigation unchanged.

**Non-Goals:**
- No backend query/schema changes.
- No multi-status combined views.
- No redesign of order detail page.

## Decisions

- Add a dedicated list helper that:
  - normalizes/filters orders by selected segment status,
  - sorts by `created` ascending.
- Default segment to `placed` for fulfillment-first workflow.
- Keep status text rendering and i18n keys as-is.

## Risks / Trade-offs

- [Risk] Orders missing/invalid `created` can break sorting. -> Mitigation: safe date fallback and deterministic tie-break.
- [Trade-off] Hidden non-segment statuses might reduce visibility. -> Mitigation: scope explicitly matches requested operational statuses.
- [Risk] Segment state reset on remount may confuse users. -> Mitigation: stable default and clear active segment styling.
