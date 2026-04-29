## Why

The current product list provides basic information but lacks detailed management capabilities. Users need a dedicated product detail page to view comprehensive product information, edit details, reset inventory amounts, and delete products when necessary. This improves inventory management efficiency and user experience.

## What Changes

- Add a new product detail screen accessible by tapping products in the storage list.
- Display full product information including amount, EAN, and barcode image.
- Enable editing of product information (name, price, barcode, EAN).
- Allow resetting the product amount to a new value.
- Provide product deletion functionality with confirmation.
- Update navigation to support routing to the product detail page.

## Capabilities

### New Capabilities
- `product-detail-management`: Enable users to view, edit, reset amount, and delete individual products from a dedicated detail page.

### Modified Capabilities
- (none)

## Impact

- New screen component under `app/product/[id].tsx` or similar routing structure.
- Updates to `components/home/ProductListItem.tsx` to make items tappable for navigation.
- New services for product update and delete operations in `services/product.ts`.
- Navigation updates in `_layout.tsx` or routing configuration.
- Potential updates to product types if additional fields are needed for editing state.