## Context

The app currently has core tabs such as storage, clients, and categories, but no dedicated Orders tab where users can browse existing orders. Users need a focused order list entry point that can be reached directly from tab navigation and that handles loading, empty, and failure scenarios reliably.

## Goals / Non-Goals

**Goals:**
- Add an Orders tab in existing bottom-tab navigation.
- Render a company-scoped order list in that tab.
- Provide predictable loading/empty/error UI states for order retrieval.
- Allow tapping a row to open existing order-detail or action flow.

**Non-Goals:**
- Rebuilding order creation/edit/payment flows.
- Changing backend order schema.
- Introducing advanced filtering/sorting beyond basic list rendering.

## Decisions

- Reuse existing order service endpoints/hooks for fetching orders in the new tab screen.
Rationale: minimizes duplicate networking logic and preserves API consistency.
Alternative considered: new dedicated endpoint. Rejected as unnecessary for first version.

- Keep Orders tab wiring in same navigation pattern as existing tabs.
Rationale: preserves user expectations and reduces nav regression risk.
Alternative considered: nested deep link only. Rejected because discoverability is worse.

- Define explicit loading/empty/error states in UI contract.
Rationale: improves reliability and avoids blank screens during fetch transitions.
Alternative considered: one generic fallback UI. Rejected due to poor state clarity.

## Risks / Trade-offs

- [Tab crowding on smaller devices] -> Mitigation: follow existing tab label/icon conventions and test on small-width layouts.
- [Order list fetch latency] -> Mitigation: show loading state immediately and keep list rendering incremental.
- [Navigation mismatch to order detail route] -> Mitigation: map row tap to existing order route contract and cover with navigation tests.
