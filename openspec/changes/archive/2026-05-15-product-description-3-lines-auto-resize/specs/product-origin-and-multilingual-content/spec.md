## MODIFIED Requirements

### Requirement: Product supports multilingual origin and content fields in create and edit flows
The system SHALL allow users to provide optional product origin and localized textual content fields (`countryOfOrigin`, `ingredients_fi`, `ingredients_sv`, `ingredients_en`, `description_fi`, `description_sv`, `description_en`) when creating and editing products. The system SHALL render each product description edit input (`description_fi`, `description_sv`, `description_en`) with a default visible height of three lines and SHALL automatically expand the input height as users enter additional lines.

#### Scenario: User enters multilingual metadata during product creation
- **WHEN** a user fills any origin, ingredients, or description language fields in the product create flow and submits successfully
- **THEN** the persisted product includes the provided values mapped to the corresponding product fields

#### Scenario: User updates multilingual metadata on product detail page
- **WHEN** a user edits any origin, ingredients, or description language fields in product detail edit mode and saves successfully
- **THEN** the persisted product updates the corresponding metadata fields

#### Scenario: Empty optional multilingual metadata is persisted safely
- **WHEN** a user leaves any origin, ingredients, or description field empty during create or update
- **THEN** the persistence payload stores a Firestore-safe null-equivalent value instead of undefined

#### Scenario: Description edit fields default to three visible lines
- **WHEN** a user enters product detail edit mode and focuses any `description_*` field before adding new text
- **THEN** the field is shown as a multiline input with three visible lines by default

#### Scenario: Description edit fields grow with multiline content
- **WHEN** a user types or pastes text that spans more than three lines into any `description_*` field in edit mode
- **THEN** the input height expands automatically to keep newly added lines visible without requiring internal field scrolling
