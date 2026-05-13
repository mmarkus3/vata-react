# add-product-form-accordion-layout Specification

## Purpose
TBD - created by archiving change add-product-accordion-sections. Update Purpose after archive.
## Requirements
### Requirement: Add-product fields are grouped into accordion sections
The system SHALL present add-product inputs in accordion groups named `basic`, `price`, and `nutritions`.

#### Scenario: Open add-product modal
- **WHEN** a user opens add-product modal
- **THEN** the form displays accordion groups for `basic`, `price`, and `nutritions`

#### Scenario: Toggle accordion section visibility
- **WHEN** a user taps an accordion section header
- **THEN** the section expands or collapses while preserving entered field values

### Requirement: Required-field path remains immediately accessible
The system SHALL keep required product create fields available without requiring users to expand optional sections first.

#### Scenario: Initial modal state
- **WHEN** the modal is first rendered
- **THEN** required input fields are visible in the default-expanded section
- **AND** optional sections are still clearly discoverable

