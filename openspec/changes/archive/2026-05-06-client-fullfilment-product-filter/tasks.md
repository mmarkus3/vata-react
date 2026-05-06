## 1. Data Loading and Filtering

- [x] 1.1 Add modal state for product source with default `Kaupan tuotteet`
- [x] 1.2 Load client fullfilments on modal open to derive client-used product IDs
- [x] 1.3 Derive filtered product list for both sources (`Kaupan tuotteet`, `Kaikki tuotteet`)
- [x] 1.4 Clear invalid selected product when source changes and current selection is no longer available

## 2. Modal UI and Interaction

- [x] 2.1 Add source selector UI in AddFullfilmentModal
- [x] 2.2 Show context-aware empty state when `Kaupan tuotteet` has no products
- [x] 2.3 Keep existing product format `Name (EAN)` and add-product flow working under both sources
- [x] 2.4 Ensure default source is visually active on modal open

## 3. Submission Compatibility

- [x] 3.1 Ensure submit payload remains unchanged regardless of selected source
- [x] 3.2 Ensure existing validation and stock-decrement behavior still works
- [x] 3.3 Ensure error handling and retry behavior remain intact after source switching

## 4. Testing and Verification

- [x] 4.1 Add/extend tests for default source and filtered product rendering
- [x] 4.2 Add/extend tests for switching to all products and continuing creation
- [x] 4.3 Add/extend tests for empty default source fallback
- [x] 4.4 Run lint/tests and document manual verification notes
