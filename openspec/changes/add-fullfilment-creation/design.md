## Context

The client detail page currently displays fullfilments but lacks the ability to create new ones. Users need to create fullfilments directly from the client context to maintain workflow efficiency. The existing codebase has established patterns for modal forms (AddClientModal) and data fetching (fullfilment service), but lacks a create function for fullfilments.

## Goals / Non-Goals

**Goals:**
- Enable fullfilment creation from client detail page
- Support multiple products per fullfilment with amounts
- Follow existing modal form patterns and validation
- Integrate with current product and client data structures
- Provide immediate feedback and refresh after creation

**Non-Goals:**
- Bulk fullfilment creation
- Fullfilment editing (separate feature)
- Advanced product filtering/search beyond basic dropdown
- Fullfilment deletion from this interface

## Decisions

### Modal Form Architecture
**Decision:** Use a modal overlay similar to AddClientModal with slide animation and backdrop dismiss
**Rationale:** Consistent with existing UI patterns, provides focused input context
**Alternatives Considered:** Inline form (too cluttered), separate screen (breaks context)

### Product Selection
**Decision:** Dropdown/picker component showing product name and EAN
**Rationale:** Simple, familiar interface; products have unique EAN identifiers
**Alternatives Considered:** Search/autocomplete (overkill for typical use), multi-select grid (complex)

### Product Amount Input
**Decision:** Numeric input field per selected product with validation
**Rationale:** Direct input allows precise amounts; validation prevents negative/zero values
**Alternatives Considered:** Slider controls (less precise), predefined amounts (too restrictive)

### Date Selection
**Decision:** Date picker component with Finnish locale
**Rationale:** Consistent with app's Finnish language; date pickers provide good UX
**Alternatives Considered:** Text input (error-prone), calendar grid (overly complex)

### Form State Management
**Decision:** Local state with useState for form fields and products array
**Rationale:** Simple, predictable; matches existing modal patterns
**Alternatives Considered:** Form library (unnecessary complexity), global state (overkill)

### Service Integration
**Decision:** Extend fullfilment service with createFullfilment function
**Rationale:** Keeps data operations centralized; follows existing service patterns
**Alternatives Considered:** Direct Firestore calls in component (violates separation), generic CRUD service (less specific)

### Data Refresh
**Decision:** Callback prop to parent component for data refresh
**Rationale:** Allows parent to handle loading states and error boundaries
**Alternatives Considered:** Automatic refresh in modal (tight coupling), global state updates (complex)

## Risks / Trade-offs

- **Risk:** Product list loading could be slow → **Mitigation:** Load products on modal open, show loading state
- **Risk:** Form complexity with multiple products → **Mitigation:** Start with single product, add/remove pattern
- **Risk:** Date format inconsistencies → **Mitigation:** Use consistent date formatting utilities
- **Risk:** Network errors during creation → **Mitigation:** Proper error handling with user feedback
- **Risk:** Memory usage with large product lists → **Mitigation:** Virtualized picker if needed later

## Migration Plan

1. Add createFullfilment function to fullfilment service
2. Create AddFullfilmentModal component
3. Add "Lisää täyttö" button to client detail page
4. Integrate modal with client detail page
5. Test with sample data and validate Firestore writes