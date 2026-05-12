## Context

Today product images are primarily handled at product creation time, while existing products do not have a clear edit path for adding new images later. The app already has product detail/edit surfaces, image picker patterns, product persistence, and list/detail consumers that render product information. This change must stay modular, preserve current modal/button styling, and keep all user-visible strings localizable with i18next.

## Goals / Non-Goals

**Goals:**
- Enable users to add one or more images to an existing product from the product detail/edit workflow.
- Persist the updated image set in the product record and reflect it in downstream product views.
- Preserve accessibility and existing UI behavior while adding image update capabilities.

**Non-Goals:**
- Rebuilding the product creation flow.
- Introducing image deletion/reordering rules beyond current behavior.
- Changing storage provider architecture or adding a new backend service.

## Decisions

1. Reuse existing product edit surface for image updates.
- Decision: Extend existing product detail/edit flow instead of creating a new standalone image-management screen.
- Rationale: Minimizes user friction and leverages existing validation/save patterns.
- Alternative considered: Dedicated image management screen. Rejected due to extra navigation complexity and duplicated state handling.

2. Treat image updates as product update operations.
- Decision: Merge newly selected images into the product's stored image collection and persist via existing product update pathway.
- Rationale: Keeps a single source of truth for product data and avoids split-write behavior.
- Alternative considered: Separate image-only endpoint/state. Rejected due to increased sync complexity with product list/detail consumers.

3. Keep compatibility with existing product list rendering.
- Decision: Ensure updated image arrays are returned in product data consumed by storage/product list screens.
- Rationale: Prevents stale or partial image data after edits.
- Alternative considered: Lazy-refresh only in detail screen. Rejected because list and detail could diverge.

4. Localize and preserve UI conventions.
- Decision: Add/adjust labels and status text via i18next keys and existing modal/button style tokens.
- Rationale: Maintains consistency and accessibility requirements already used in app UI.

## Risks / Trade-offs

- [Risk] Image upload failure during product save can leave user uncertain about result. -> Mitigation: show explicit success/failure states and avoid updating local UI state until save result is known.
- [Risk] Larger image collections may impact list/detail rendering performance. -> Mitigation: keep list thumbnails lightweight and rely on existing image component optimizations.
- [Risk] Reusing edit flow can increase component complexity. -> Mitigation: isolate image selection/upload logic into focused helpers/components.
