## MODIFIED Requirements

### Requirement: Storage page displays product inventory as a list
The storage page SHALL render a scrollable list of products using the existing `Product` type, displayed amounts SHALL reflect inventory decrements caused by successful fullfilment creation, each product row SHALL use the latest saved product image data when image references are available, and product data used by the list SHALL include latest saved `retailPrice` and `unitPrice` values when present.

#### Scenario: Storage page shows product items
- **WHEN** the storage page loads with product data available
- **THEN** the page displays each product as a list row containing name, amount, price

#### Scenario: Storage page renders empty state when no products exist
- **WHEN** the storage page loads and the product list is empty
- **THEN** the page displays a friendly empty state message indicating no inventory is available

#### Scenario: Product amount reflects fullfilment decrement
- **WHEN** a fullfilment is created that includes a product shown in storage
- **THEN** the stored amount for that product is reduced by the submitted fullfilment amount

#### Scenario: Storage row uses updated product image data
- **WHEN** a product has newly added images saved through product editing
- **THEN** subsequent storage list renders use the updated product image references for that product

#### Scenario: Storage list data includes updated retail and unit prices
- **WHEN** a product has retail and/or unit price values saved through create or edit
- **THEN** subsequent storage list data reads include the saved `retailPrice` and `unitPrice` values for that product
