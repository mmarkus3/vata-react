## Why

The storage page currently shows only a placeholder screen, so users cannot see or manage inventory items directly from the app. Displaying products as a list on the storage page will make inventory visible and actionable, improving usability for warehouse and storage users.

## What Changes

- Add a product list view to `app/home/index.tsx` using the existing `Product` type.
- Render each product as a styled list item showing name, amount, price.
- Add a `products` data source in the storage page, get `products` from Firestore using `service/firestore.ts`, use `onSnapshot` from `firebase/firestore` library. Add generic new function if needed to `service/firestore.ts`.
- Ensure list styling and layout match the app’s Tailwind/NativeWind design patterns.
- Keep the existing storage page entry point and navigation intact.

## Capabilities

### New Capabilities
- `storage-product-list`: Add a product list view to the storage page so users can see inventory items in a structured list.

### Modified Capabilities
- (none)

## Impact

- `app/home/index.tsx` will be updated to render a product list instead of the placeholder text.
- May add a new component under `components/` for reusable product list items.
- Uses existing `types/product.ts` for typing product data.
- New function to `service/firestore.ts` that uses `onSnapshot` to fetch items from Firestore.
