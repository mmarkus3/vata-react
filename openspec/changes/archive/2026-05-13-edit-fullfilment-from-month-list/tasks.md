## 1. Fullfilment Service Update Support

- [x] 1.1 Add fullfilment update service method for editing an existing fullfilment
- [x] 1.2 Implement atomic inventory delta adjustment for edited line-item amounts
- [x] 1.3 Add error mapping for insufficient stock and transaction failures in edit flow

## 2. Client Monthly List Interaction

- [x] 2.1 Make monthly fullfilment rows tappable in `activeTab === 0` list
- [x] 2.2 Add selected fullfilment state and open/close edit modal state management
- [x] 2.3 Prefill edit form with selected fullfilment date, lines, amounts, and prices

## 3. Fullfilment Edit UI and Save Flow

- [x] 3.1 Build edit modal UI reusing add-fullfilment validation patterns
- [x] 3.2 Support line add/remove/edit for amount and price in edit mode
- [x] 3.3 Save edited fullfilment via service and refresh monthly/product grouped data
- [x] 3.4 Keep modal open and show clear errors when save fails

## 4. Testing and Verification

- [x] 4.1 Add/extend tests for opening edit from monthly list and prefilled values
- [x] 4.2 Add/extend tests for successful edit save and list refresh
- [x] 4.3 Add/extend tests for inventory delta behavior on increased/decreased/removed lines
- [x] 4.4 Run lint/tests and document manual verification notes
