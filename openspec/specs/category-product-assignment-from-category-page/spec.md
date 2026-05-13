# category-product-assignment-from-category-page Specification

## Purpose
TBD - created by archiving change add-product-to-category-from-category-page. Update Purpose after archive.
## Requirements
### Requirement: Category detail supports product selection and assignment
The system SHALL allow users to select products from category detail and assign them to the current category in one flow.

#### Scenario: Show candidate products for assignment
- **WHEN** a user opens add-products flow in category detail
- **THEN** the system shows products available for assignment for the same company
- **AND** excludes products already assigned to the current category

#### Scenario: Successful assignment updates selected products
- **WHEN** a user confirms assignment with one or more selected products
- **THEN** the system updates selected product category values to the current category
- **AND** shows success feedback

#### Scenario: Assignment failure shows actionable error
- **WHEN** one or more product updates fail during assignment
- **THEN** the system shows an error message and keeps user context so they can retry

