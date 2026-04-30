## 1. Data Layer Extension

- [x] 1.1 Add createClient function to services/client.ts
- [x] 1.2 Implement Firestore save operation with company association
- [x] 1.3 Add error handling and type safety to createClient function

## 2. Modal Component Creation

- [x] 2.1 Create components/clients/AddClientModal.tsx component
- [x] 2.2 Implement modal layout with slide-up animation and backdrop
- [x] 2.3 Add form fields for all client properties (name, company, address, phone, email)
- [x] 2.4 Implement form state management with useState hooks

## 3. Form Validation

- [x] 3.1 Add required field validation for name, company, and email
- [x] 3.2 Implement email format validation with regex
- [x] 3.3 Add phone number format validation (Finnish format)
- [x] 3.4 Display validation errors inline with form fields

## 4. UI Integration

- [x] 4.1 Add "Lisää asiakas" button to clients page header
- [x] 4.2 Implement modal state management in clients page
- [x] 4.3 Handle modal open/close functionality
- [x] 4.4 Add loading states and error handling to modal

## 5. Client Creation Logic

- [x] 5.1 Implement form submission handler with validation
- [x] 5.2 Add client creation API call with error handling
- [x] 5.3 Implement form reset after successful creation
- [x] 5.4 Add automatic client list refresh after creation

## 6. Testing and Validation

- [x] 6.1 Run TypeScript compilation check (npx tsc --noEmit)
- [ ] 6.2 Test client creation form validation
- [ ] 6.3 Verify modal open/close functionality
- [ ] 6.4 Test successful client creation and list update
- [ ] 6.5 Test error handling scenarios