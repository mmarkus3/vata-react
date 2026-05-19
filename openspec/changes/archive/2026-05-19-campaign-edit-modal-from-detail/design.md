## Context

Campaign detail page exists and displays campaign information, but editing is not supported. Creation flow already has campaign form patterns and validation logic that can be reused/adapted. A dedicated edit modal is requested for detail page rather than reusing create modal directly.

## Goals / Non-Goals

**Goals:**
- Add edit action on campaign detail page.
- Show dedicated edit modal with prefilled campaign values.
- Save updates to campaign document and refresh detail view.

**Non-Goals:**
- Bulk editing campaigns.
- Reworking campaign list screen UX.
- Introducing campaign delete in this change.

## Decisions

- Create a separate `CampaignEditModal` component file tailored for editing existing campaigns.
- Reuse campaign form validation and normalization utilities where possible to avoid duplicate rules.
- Add campaign service `updateCampaign` by campaign ID with Firestore-safe normalization.
- Keep edit fields aligned with create flow (dates, targeting, discount, code) unless explicitly read-only.

## Risks / Trade-offs

- [State divergence] Detail page data can become stale after update -> reload campaign data after successful save.
- [Validation drift] Separate edit modal could diverge from create rules -> centralize shared validation helpers.
- [Backward compatibility] Existing detail rendering should remain stable if optional fields missing -> preserve fallbacks.
