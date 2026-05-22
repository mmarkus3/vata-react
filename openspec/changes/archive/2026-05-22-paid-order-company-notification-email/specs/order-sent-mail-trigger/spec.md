## ADDED Requirements

### Requirement: onMail renders paid-order company notification
The mail processing function SHALL support `recieveNotification` order notification emails and send them with title `Uusi tilaus vastaanotettu`.

#### Scenario: Paid-order company notification email is sent
- **WHEN** a `mail` document has `recieveNotification` and valid `order` reference
- **THEN** system sends an email titled `Uusi tilaus vastaanotettu`
- **AND** email body includes order id and product lines (name and amount)

#### Scenario: Missing order for recieveNotification is handled safely
- **WHEN** `recieveNotification` mail is processed but referenced order is missing
- **THEN** system does not send email and logs an error
