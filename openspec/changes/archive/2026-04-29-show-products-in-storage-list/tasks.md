## 1. Setup and Data Modeling

- [ ] 1.1 Review `types/product.ts` and confirm the existing product shape is correct for storage list rendering
- [ ] 1.2 Add generic function to `service/firestore.ts` to get product array using `onSnapshot` from `firebase/firestore` and use that in `app/home/index.tsx`

## 2. UI Implementation

- [ ] 2.1 Update `app/home/index.tsx` to render a scrollable list of `Product` items instead of placeholder text
- [ ] 2.2 Render product name, amount, and price in each list row
- [ ] 2.3 Apply Tailwind/NativeWind styling for readable text, row spacing, and background contrast

## 3. Reusability and Accessibility

- [ ] 3.1 Extract a reusable `ProductListItem` component if the row markup is larger than a few lines
- [ ] 3.2 Verify each row is touch-friendly and text contrast meets readability standards

## 4. Validation

- [ ] 4.1 Confirm the storage page shows products correctly when the list contains items
- [ ] 4.2 Confirm an empty-state message appears when the product list is empty
- [ ] 4.3 Make sure the implementation compiles without TypeScript errors