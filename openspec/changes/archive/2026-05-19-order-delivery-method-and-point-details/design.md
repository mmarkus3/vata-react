## Context

Order detail page already fetches order data and renders status/products/customer details, but delivery method and selected point metadata are missing. Required point details live behind backend API and need company + point identifiers.

## Goals / Non-Goals

**Goals:**
- Render `deliveryMethod` on order detail page.
- Fetch selected point information from backend using configured base URL and required path.
- Handle loading/failure of point fetch without breaking order detail page.

**Non-Goals:**
- Redesigning entire order detail layout.
- Changing backend API contract.
- Editing delivery method/point from frontend.

## Decisions

- Add order-point fetch helper in service layer that builds URL from `EXPO_PUBLIC_FIREBASE_API` and path `orders/company/:company/point/:id`.
- Trigger point fetch only when order has both `company` and point identifier.
- Keep point-fetch errors isolated (show fallback text instead of failing whole order screen).
- Add localized labels and fallback messages for delivery method and point sections.

## Risks / Trade-offs

- [Missing env var] If `EXPO_PUBLIC_FIREBASE_API` is undefined, request cannot run -> return safe fallback error/message and keep screen usable.
- [Partial order data] Some orders may miss point ID -> show explicit “not selected” style fallback.
- [API latency] Secondary fetch adds delay -> render order first and point info progressively.
