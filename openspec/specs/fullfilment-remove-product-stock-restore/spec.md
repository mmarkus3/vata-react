# fullfilment-remove-product-stock-restore Specification

## Purpose
TBD - created by archiving change fullfilment-remove-product-restores-stock. Update Purpose after archive.
## Requirements
### Requirement: Removing product from fullfilment restores stock
The backend SHALL restore stock for a product when that product line is removed during fullfilment update.

#### Scenario: Product removed from fullfilment line items
- **WHEN** fullfilment update removes a previously existing product line
- **THEN** backend increments that product stock by the removed line amount

#### Scenario: Multiple removed lines are all restored
- **WHEN** fullfilment update removes multiple product lines
- **THEN** backend restores stock for each removed product line amount

