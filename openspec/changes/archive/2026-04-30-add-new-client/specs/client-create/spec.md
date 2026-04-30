## ADDED Requirements

### Requirement: Display add client button
The system SHALL display an "Add Client" button in the clients page header, positioned next to the client count display.

#### Scenario: Add client button visible
- **WHEN** user navigates to the clients page
- **THEN** system displays an "Add Client" button in the header
- **AND** button is positioned next to the client count
- **AND** button uses primary theme color

### Requirement: Open client creation modal
The system SHALL open a modal form when the user taps the "Add Client" button.

#### Scenario: Modal opens on button tap
- **WHEN** user taps the "Add Client" button
- **THEN** system opens a slide-up modal with client creation form
- **AND** modal has a backdrop that can be tapped to close
- **AND** modal displays "Add Client" title

### Requirement: Client form fields
The system SHALL provide form fields for all required client information: name, company, street address, postal code, city, phone, and email.

#### Scenario: Form displays all fields
- **WHEN** client creation modal opens
- **THEN** system displays text input fields for name, company, street, postal code, city, phone, and email
- **AND** fields have appropriate placeholders and keyboard types
- **AND** required fields are clearly marked

### Requirement: Form validation
The system SHALL validate form input and prevent submission of invalid data.

#### Scenario: Required field validation
- **WHEN** user attempts to save without required fields
- **THEN** system displays validation errors for empty required fields
- **AND** highlights fields with errors
- **AND** prevents form submission

#### Scenario: Email format validation
- **WHEN** user enters invalid email format
- **THEN** system displays "Invalid email format" error
- **AND** prevents form submission

#### Scenario: Phone format validation
- **WHEN** user enters invalid phone format
- **THEN** system displays "Invalid phone format" error
- **AND** prevents form submission

### Requirement: Create client in database
The system SHALL save the new client to Firestore when form validation passes.

#### Scenario: Successful client creation
- **WHEN** user fills valid data and taps save
- **THEN** system saves client to Firestore with company association
- **AND** closes the modal
- **AND** clears the form
- **AND** updates the client list automatically

#### Scenario: Client creation failure
- **WHEN** client creation fails due to network or server error
- **THEN** system displays error message
- **AND** keeps modal open with form data intact
- **AND** allows user to retry submission

### Requirement: Loading states
The system SHALL display appropriate loading indicators during client creation.

#### Scenario: Loading during save
- **WHEN** user taps save button
- **THEN** system displays loading indicator on save button
- **AND** disables form interactions until operation completes

### Requirement: Modal dismissal
The system SHALL allow users to cancel client creation by dismissing the modal.

#### Scenario: Cancel via backdrop tap
- **WHEN** user taps the modal backdrop
- **THEN** system closes the modal without saving
- **AND** discards any entered data

#### Scenario: Cancel via cancel button
- **WHEN** user taps the "Cancel" button
- **THEN** system closes the modal without saving
- **AND** discards any entered data