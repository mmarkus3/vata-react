## Context

The application currently has a clients list page that displays basic client information and allows creating new clients. Users need to view detailed client information and track fullfilments associated with each client. Fullfilments contain product information, amounts, dates, and are linked to specific clients.

Current state:
- Clients are stored in Firestore with basic information (name, company, contact details, address)
- Fullfilments are stored separately with references to clients and products
- Navigation follows Expo Router patterns with dynamic routes (e.g., `/product/[id].tsx`)

## Goals / Non-Goals

**Goals:**
- Create a client detail page accessible via `/client/[id].tsx` route
- Display comprehensive client information in a clean, readable format
- Show fullfilment history grouped by month
- Show fullfilment history grouped by product and month
- Follow existing UI patterns and styling conventions
- Ensure responsive design for mobile devices

**Non-Goals:**
- Edit client information (separate feature)
- Delete clients (separate feature)
- Export fullfilment data (separate feature)
- Real-time updates for fullfilments (use existing patterns if needed)

## Decisions

### Navigation Pattern
**Decision:** Use Expo Router dynamic routes with `/client/[id].tsx` following the existing product detail pattern.

**Rationale:** Consistent with existing navigation patterns in the app. The product detail page uses the same structure and provides a good template for implementation.

**Alternatives Considered:**
- Modal overlay: Would break navigation history and deep linking
- Tab-based navigation: Overkill for single client view

### Data Fetching Strategy
**Decision:** Extend the client service with `getClientFullfilments(clientId)` function that queries Firestore for fullfilments filtered by client ID.

**Rationale:** Keeps data access logic centralized in services layer. Follows existing patterns where each entity has its own service file.

**Alternatives Considered:**
- Fetch fullfilments in a custom hook: Would duplicate service logic
- Include fullfilments in client query: Would make client queries heavier for list views

### UI Structure
**Decision:** Use ScrollView with sections for client info, monthly fullfilments, and product-grouped fullfilments.

**Rationale:** Follows the product detail page pattern with ScrollView for content that may exceed screen height. Sections provide clear information hierarchy.

**Alternatives Considered:**
- FlatList: Not suitable since content is not a simple list
- Multiple screens: Would complicate navigation

### Grouping Logic
**Decision:** Implement grouping logic in a utility function that processes fullfilment arrays into month-based and product-month-based structures.

**Rationale:** Keeps business logic separate from UI components. Allows for easy testing and reuse.

**Alternatives Considered:**
- Group in Firestore query: Would require complex aggregation queries
- Group in component: Would make components harder to test

## Risks / Trade-offs

**Performance with large fullfilment history** → Mitigation: Implement pagination or lazy loading if performance issues arise with many fullfilments

**Complex grouping logic** → Mitigation: Write comprehensive unit tests for grouping functions

**UI complexity on small screens** → Mitigation: Test on various device sizes and adjust spacing/styling as needed

**Data consistency** → Mitigation: Use existing error handling patterns and display appropriate loading/error states