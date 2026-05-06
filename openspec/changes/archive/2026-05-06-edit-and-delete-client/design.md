## Context

Client detail currently supports viewing data and creating fullfilments, but client records cannot be edited or deleted. Users need lifecycle operations to keep client data current and remove obsolete entries. The change spans UI actions in client detail, modal/confirmation flows, and client service methods.

## Goals / Non-Goals

**Goals:**
- Enable editing client core fields from client detail.
- Enable deleting client with explicit destructive-action confirmation.
- Reuse existing validation and form patterns used in client creation.
- Provide robust loading, success, and error states for both operations.

**Non-Goals:**
- Bulk client edits or bulk delete.
- Cascading data deletion for related fullfilments/products (unless already defined elsewhere).
- Advanced role-based authorization changes.

## Decisions

### Edit via modal form prefilled with current client data
- **Decision:** Use a modal form similar to existing add-client patterns, prefilled from current client.
- **Rationale:** Consistent UX and reduced implementation risk.
- **Alternative considered:** Inline editable fields on detail page; rejected due to layout complexity.

### Delete via confirmation dialog requiring explicit intent
- **Decision:** Use a dedicated confirmation step before delete and disable repeated taps while pending.
- **Rationale:** Prevents accidental data loss.
- **Alternative considered:** Immediate delete button; rejected as too risky.

### Service-layer update/delete wrappers
- **Decision:** Implement update/delete through `services/client.ts` and keep Firestore access encapsulated.
- **Rationale:** Maintains modularity and consistent error handling.
- **Alternative considered:** Direct page-level Firestore calls; rejected due to coupling.

## Risks / Trade-offs

- **Accidental deletion** -> Mitigated with explicit confirmation and cancel-first design.
- **Stale detail view after edit** -> Mitigated by refreshing or updating local client state after success.
- **Validation drift between create/edit forms** -> Mitigated by reusing validation rules and helper patterns.
- **Delete conflicts with related data** -> Mitigated by surfacing backend/service errors clearly to user.

## Migration Plan

1. Add update/delete service functions for clients.
2. Add edit modal and delete confirmation UI/actions in client detail.
3. Wire success navigation/state refresh and failure feedback.
4. Add tests for update, delete, and validation/error scenarios.

## Open Questions

- Should delete be blocked when client has existing fullfilments, or allowed with preserved historical references?
