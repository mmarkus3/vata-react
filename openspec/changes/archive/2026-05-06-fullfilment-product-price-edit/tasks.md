## 1. Modal Form Enhancements

- [x] 1.1 Add line-price input state to AddFullfilmentModal
- [x] 1.2 Prefill line-price from selected product price on product selection
- [x] 1.3 Show line-price field in add-product section
- [x] 1.4 Clear/reset line-price input appropriately after adding a line

## 2. Validation and Line Assembly

- [x] 2.1 Add numeric validation for line-price input
- [x] 2.2 Display clear price validation errors in modal
- [x] 2.3 Include edited line-price in selected products list entries
- [x] 2.4 Keep existing amount/date/product validations unchanged

## 3. Fullfilment Payload and Persistence

- [x] 3.1 Ensure submit payload maps line-item price into `fullfilment.products[].product.price`
- [x] 3.2 Ensure unchanged behavior when user accepts default product price
- [x] 3.3 Ensure storage decrement flow remains unaffected by price editing

## 4. Testing and Verification

- [x] 4.1 Add/extend tests for default line-price behavior
- [x] 4.2 Add/extend tests for edited line-price persistence in payload
- [x] 4.3 Add/extend tests for invalid line-price validation
- [x] 4.4 Run lint/tests and document manual verification notes
