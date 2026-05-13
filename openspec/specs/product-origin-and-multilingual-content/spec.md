# product-origin-and-multilingual-content Specification

## Purpose
TBD - created by archiving change product-origin-ingredients-description-fields. Update Purpose after archive.
## Requirements
### Requirement: Product supports multilingual origin and content fields in create and edit flows
The system SHALL allow users to provide optional product origin and localized textual content fields (`countryOfOrigin`, `ingredients_fi`, `ingredients_sv`, `ingredients_en`, `description_fi`, `description_sv`, `description_en`) when creating and editing products.

#### Scenario: User enters multilingual metadata during product creation
- **WHEN** a user fills any origin, ingredients, or description language fields in the product create flow and submits successfully
- **THEN** the persisted product includes the provided values mapped to the corresponding product fields

#### Scenario: User updates multilingual metadata on product detail page
- **WHEN** a user edits any origin, ingredients, or description language fields in product detail edit mode and saves successfully
- **THEN** the persisted product updates the corresponding metadata fields

#### Scenario: Empty optional multilingual metadata is persisted safely
- **WHEN** a user leaves any origin, ingredients, or description field empty during create or update
- **THEN** the persistence payload stores a Firestore-safe null-equivalent value instead of undefined

