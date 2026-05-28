## ADDED Requirements

### Requirement: Category names are translated on create
The system SHALL automatically translate a newly created category `name` to Swedish and English and persist the translations to `name_sv` and `name_en`.

#### Scenario: New category with name
- **WHEN** a category document is created with a non-empty `name`
- **THEN** the backend translates the name to Swedish and English
- **AND** writes the translated values to `name_sv` and `name_en`

#### Scenario: New category without name
- **WHEN** a category document is created without a usable `name`
- **THEN** the backend does not call the translation service
- **AND** does not write translation fields

### Requirement: Category names are translated on name update
The system SHALL refresh `name_sv` and `name_en` when an existing category document's `name` changes.

#### Scenario: Category name changed
- **WHEN** a category document is updated and `name` differs from the previous value
- **THEN** the backend translates the new name to Swedish and English
- **AND** updates `name_sv` and `name_en` with the new translated values

#### Scenario: Category name unchanged with translations present
- **WHEN** a category document is updated and `name` is unchanged while `name_sv` and `name_en` already exist
- **THEN** the backend does not call the translation service
- **AND** does not write translation fields again

#### Scenario: Category name unchanged but translations missing
- **WHEN** a category document is updated and `name` is unchanged but either `name_sv` or `name_en` is missing
- **THEN** the backend translates the existing name
- **AND** writes the missing translation fields

### Requirement: Category translation trigger avoids recursive writes
The system SHALL avoid unnecessary writes from the category translation trigger when translated fields already match the desired values.

#### Scenario: Translation values already match
- **WHEN** the backend computes Swedish and English translations equal to the category document's existing `name_sv` and `name_en`
- **THEN** the backend does not update the category document

#### Scenario: Category deleted
- **WHEN** a category document is deleted
- **THEN** the backend does not call the translation service
- **AND** does not write translation fields

### Requirement: Category translation failures are non-blocking
The system SHALL treat translation failures as non-blocking background failures and log the failure for diagnostics.

#### Scenario: Translation service fails
- **WHEN** Google Translate returns an error while translating a category name
- **THEN** the backend logs the translation failure
- **AND** the original category write remains completed
