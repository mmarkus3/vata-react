## MODIFIED Requirements

### Requirement: Product detail edit form uses declarative field state
The product detail edit flow SHALL manage editable scalar product fields, including optional category selection, through a declarative form model that centralizes field values, validation rules, submit handling, and accordion-grouped field presentation.

#### Scenario: Edit mode preloads current product values
- **WHEN** a user enters product edit mode on `app/product/[id].tsx`
- **THEN** the form is initialized with the currently loaded product field values

#### Scenario: Save is blocked for invalid required/numeric fields
- **WHEN** a user attempts to save with missing required fields or invalid numeric values
- **THEN** the system blocks save and shows localized field validation errors

#### Scenario: Valid form submits through existing update workflow
- **WHEN** a user saves with valid form inputs
- **THEN** the system submits the transformed payload through the existing product update flow
- **AND** preserves existing save lifecycle behavior (loading, refresh, edit-mode exit)

#### Scenario: Edit submission includes chosen category value
- **WHEN** a user saves product edits with a selected category value
- **THEN** the update payload includes that category value

#### Scenario: Validation errors remain discoverable in collapsed sections
- **WHEN** a validation error occurs for a field inside a collapsed accordion section
- **THEN** the section containing that field is expanded so the user can correct the value
