## Context

The clients page currently only displays existing clients in a read-only list. Users need the ability to add new clients to expand their client management capabilities. The application already has established patterns for modal forms and data creation, as seen in the AddProductModal component.

## Goals / Non-Goals

**Goals:**
- Provide a user-friendly modal form for creating new clients
- Include all required client fields with proper validation
- Follow existing design patterns for consistency
- Automatically update the client list after successful creation
- Handle loading and error states appropriately

**Non-Goals:**
- Client editing or deletion functionality
- Bulk client import capabilities
- Client search or filtering features
- Advanced form features like auto-complete

## Decisions

**Modal Form Architecture:**
- Create `AddClientModal` component following the `AddProductModal` pattern
- Use slide-up modal animation with backdrop for consistency
- Include form fields for all Client interface properties: name, company, address (street, postalCode, city), phone, email

**Form Validation:**
- Required field validation for name, company, and email
- Email format validation using basic regex
- Phone number format validation (Finnish format)
- Address fields as optional but recommended

**Data Layer Extension:**
- Extend `services/client.ts` with `createClient` function
- Follow the same pattern as `createProduct` with error handling
- Use Firestore `saveItem` function for data persistence
- Include company-based access control

**UI Integration:**
- Add "Add Client" button to clients page header following product page pattern
- Use consistent styling with theme colors (primary/secondary/gray)
- Position button next to client count display
- Handle modal state management in the clients page component

**Error Handling:**
- Display validation errors inline with form fields
- Show general error messages for API failures
- Provide clear error messages in Finnish to match existing UI

## Risks / Trade-offs

**Form Complexity:**
- Client form has more fields than product form (address fields)
- Risk: Users might find the form overwhelming
- Mitigation: Group related fields and use clear labels

**Data Validation:**
- Client data needs to be accurate for business use
- Risk: Insufficient validation could lead to poor data quality
- Mitigation: Implement comprehensive validation with clear error messages

**Real-time Updates:**
- New clients should appear immediately in the list
- Risk: Firestore subscription might have delays
- Mitigation: Optimistic UI updates with proper error handling