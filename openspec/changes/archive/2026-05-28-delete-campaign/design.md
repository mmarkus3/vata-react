## Context

Campaigns currently support list, create, detail and edit flows. The campaign detail page already owns the selected campaign, edit modal state, localized error display and access to the route ID. The shared Firestore service layer already exposes `deleteItem`, and other domain services wrap it with collection-specific delete helpers.

Campaign deletion should remain a management UI action. The external webshop/backend campaign logic reads campaign documents but does not need a new backend endpoint for management deletion.

## Goals / Non-Goals

**Goals:**
- Add a campaign delete action to the campaign detail page.
- Confirm destructive deletion before removing the Firestore document.
- Use a campaign service helper that wraps `deleteItem('campaigns', id)`.
- Navigate back to the campaigns tab after successful deletion.
- Keep localized feedback and disabled/loading state consistent with existing management actions.

**Non-Goals:**
- No soft-delete/archive state for campaigns.
- No campaign delete action from the list row in this change.
- No backend API changes.
- No cascading deletion of products, orders or generated campaign-derived data.

## Decisions

1. Delete from the detail page rather than inline from the list.
Rationale: the detail page is where users can inspect campaign targeting and discount information before taking a destructive action.
Alternative considered: list-row delete affordance. Rejected for the first iteration because it is easier to delete the wrong campaign from a compact list.

2. Use React Native `Alert.alert` confirmation before calling the service.
Rationale: this matches the existing product delete confirmation pattern and avoids adding modal state for a simple destructive confirmation.
Alternative considered: custom confirmation modal. Rejected because it adds unnecessary surface area for one confirmation step.

3. Implement `deleteCampaign(campaignId)` in `services/campaign.ts`.
Rationale: campaign collection details stay in the service layer and tests can verify the collection key/error mapping.
Alternative considered: call `deleteItem` directly from the screen. Rejected because other services expose domain-specific wrappers and it would duplicate collection knowledge in the UI.

4. Route back to `/(home)/campaigns` after success.
Rationale: the current detail route no longer has backing data after deletion, and the campaigns list subscription will reflect the removed document.
Alternative considered: stay on the detail page and show not found. Rejected because it feels like an error after a successful user action.

## Risks / Trade-offs

- [Risk] A user deletes an active campaign that is currently affecting webshop prices. -> Mitigation: require explicit confirmation and delete only after the user confirms.
- [Risk] Deletion fails due to permissions or network issues. -> Mitigation: keep the user on the detail page and show a localized error while re-enabling actions.
- [Risk] Double taps trigger duplicate delete calls. -> Mitigation: use an `isDeleting` state to disable destructive actions while the delete request is in flight.
- [Risk] Firestore rules may deny deletion for unauthorized users. -> Mitigation: rely on existing Firestore security rules and surface the service error.
