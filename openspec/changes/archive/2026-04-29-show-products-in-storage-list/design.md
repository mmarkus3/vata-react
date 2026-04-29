## Context

The current storage page at `app/home/index.tsx` only renders placeholder text and does not surface inventory product details. The app already has a `Product` type defined in `types/product.ts`, so this feature can be implemented as a UI-first enhancement using typed product data.

## Goals / Non-Goals

**Goals:**
- Render a scrollable list of products on the storage page.
- Use the existing `Product` interface for typing.
- Display product name, amount, and price, in each list item.
- Keep the layout consistent with the app's Tailwind/NativeWind styling.
- Ensure the list remains accessible and touch-friendly.

**Non-Goals:**
- Building a full backend inventory API or syncing product data from Firebase.
- Adding complex filtering, search, or sorting features on first pass.

## Decisions

- **List placement:** Implement the list directly in `app/home/index.tsx` because it is the current storage screen and the simplest location for this UI improvement.
- **Data source:** Use `services/firestore.ts`.
- **Component structure:** Create a small reusable `ProductListItem` component under `components/` if the row markup becomes large enough. Otherwise, keep the list rendering within the storage page component.
- **Styling:** Use Tailwind/NativeWind classes for row layout, spacing, and typography to match app conventions.
- **Accessibility:** Use readable text sizes and sufficient vertical padding so each item is easy to tap.

## Risks / Trade-offs

- [Risk] → Adding list rows directly in `app/home/index.tsx` could make the screen component bulky.
  - Mitigation: Keep the implementation small and extract a row component only if needed.

## Open Questions

- If the storage page already has a navigation layout, does the product list need to live inside a nested screen wrapper? Yes