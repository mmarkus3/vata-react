## MODIFIED Requirements

### Requirement: Fullfilment Creation Submission
The system SHALL create the fullfilment in the database, decrement product inventory for included products, and refresh the client detail page.

#### Scenario: Successful fullfilment creation
- **WHEN** user fills valid fullfilment data and taps "Tallenna"
- **THEN** system creates the fullfilment in Firestore with client reference
- **AND** decrements each selected product amount in storage
- **AND** closes the modal
- **AND** refreshes the fullfilment list on the client detail page

#### Scenario: Handle creation errors
- **WHEN** fullfilment creation fails due to network or database errors
- **THEN** system displays an error message
- **AND** keeps the modal open with form data intact
- **AND** allows user to retry submission

#### Scenario: Handle insufficient inventory
- **WHEN** fullfilment creation fails because one or more selected products have insufficient stock
- **THEN** system displays an error message indicating insufficient stock
- **AND** keeps the modal open with form data intact
- **AND** does not create the fullfilment
