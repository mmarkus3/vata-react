## Context

The clients page (`app/home/clients.tsx`) is currently empty and needs to display a list of clients. The application already has established patterns for data management using Firebase/Firestore, custom hooks for state management, and consistent UI components following NativeWind styling. The Client interface is already defined in `types/client.ts` and Firestore rules are configured for the clients collection.

## Goals / Non-Goals

**Goals:**
- Display clients in a scrollable list with essential information
- Follow existing patterns from the products functionality for consistency
- Implement real-time data fetching from Firestore
- Provide loading and error states
- Ensure responsive design with proper touch targets

**Non-Goals:**
- Client creation, editing, or deletion functionality (CRUD operations beyond listing)
- Advanced filtering or search capabilities
- Client detail pages or navigation
- Offline data synchronization

## Decisions

**Data Layer Architecture:**
- Create `services/client.ts` for Firestore operations (getAllClients)
- Follow the same pattern as `services/product.ts` with error handling and type safety
- Use company-based filtering consistent with existing Firestore rules

**State Management:**
- Create `hooks/useClients.ts` hook following the `useProducts` pattern
- Include loading states, error handling, and real-time subscription
- Use React hooks for local state management

**UI Components:**
- Create `components/clients/ClientListItem.tsx` for individual client display
- Follow the same structure as product list items
- Use NativeWind classes with theme colors (primary/secondary/gray)
- Display key client information: name, company, phone, email

**Page Implementation:**
- Update `app/home/clients.tsx` to use the new hook and components
- Implement FlatList for performance with large client lists
- Include empty state when no clients exist
- Handle loading and error states gracefully

## Risks / Trade-offs

**Performance with Large Client Lists:**
- FlatList with proper optimization should handle reasonable client counts
- Real-time subscriptions may impact performance with very large datasets
- Mitigation: Implement pagination if needed in future iterations

**UI Consistency:**
- Following existing patterns ensures familiarity but may limit innovation
- Mitigation: Patterns are well-established and tested in the products functionality

**Data Security:**
- Firestore rules already enforce company-based access control
- No additional security considerations needed for read-only listing