## MODIFIED Requirements

### Requirement: Product detail edit form uses declarative field state
The product detail edit flow SHALL manage editable scalar product fields, including optional category selection, optional origin field, optional multilingual ingredient fields, optional multilingual description fields, and `showInWebshop` webshop visibility, through a declarative form model that centralizes field values, validation rules, submit handling, and accordion-grouped field presentation across `basic`, `additionalInfo`, `price`, and `nutritions` sections.

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

#### Scenario: Edit submission includes optional origin and multilingual content values
- **WHEN** a user sets `countryOfOrigin`, any `ingredients_*` field, or any `description_*` field and saves successfully
- **THEN** the update payload includes the corresponding normalized field values

#### Scenario: Edit submission includes webshop visibility value
- **WHEN** a user sets `showInWebshop` and saves successfully
- **THEN** the update payload includes the selected boolean `showInWebshop` value

#### Scenario: Validation errors remain discoverable in collapsed sections
- **WHEN** a validation error occurs for a field inside a collapsed accordion section
- **THEN** the section containing that field is expanded so the user can correct the value
