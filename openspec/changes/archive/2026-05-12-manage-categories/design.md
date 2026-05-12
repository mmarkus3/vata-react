## Context

The application uses React-Native with Expo and manages data through Firebase Firestore. Current UI patterns include modal-based workflows for create/edit operations (see `components/clients/` and `components/home/` for reference). The existing codebase has established patterns for:
- Custom hooks for data fetching and mutations (`useClients`, `useProducts`)
- Context providers for state management (`AuthProvider`, `StorageProvider`)
- Service layer encapsulation for Firebase operations
- Modal components with validation (AddClientModal, EditClientModal, etc.)
- Firestore integration with proper error handling

The new Categories feature must follow these established patterns for consistency and maintainability.

## Goals / Non-Goals

**Goals:**
- Implement a Categories page accessible from the home navigation
- Enable CRUD operations (create, read, update, delete) for categories
- Use existing UI patterns and component styles (NativeWind/Tailwind)
- Maintain Firestore data synchronization in real-time
- Provide proper error handling and loading states
- Follow TypeScript strict mode and the project's coding guidelines

**Non-Goals:**
- Bulk import/export of categories
- Category hierarchy or nesting
- Permission-based category access control (multi-user management)
- Category analytics or usage tracking
- Integration with product categorization (that's a separate spec)

## Decisions

1. **Service Layer Architecture**
   - Decision: Create `services/category.ts` as a dedicated service module
   - Rationale: Separates category operations from other storage operations, improves testability and maintainability
   - Alternatives: Add to existing `services/storage.ts` (harder to test) or embed in hook (violates separation of concerns)

2. **Custom Hook Pattern**
   - Decision: Create `useCategories()` hook that returns categories, isLoading, error, and mutation functions (create, update, delete)
   - Rationale: Consistent with existing patterns (`useClients`, `useProducts`), enables component reusability
   - Alternatives: Use inline Firestore calls (code duplication) or Redux (overcomplicated for this scope)

3. **Modal Workflow for Create/Edit**
   - Decision: Use modal components (`AddCategoryModal.tsx`, `EditCategoryModal.tsx`) similar to existing client/product modals
   - Rationale: Consistent with app's established UX patterns, keeps page layout clean
   - Alternatives: Inline form editing (less discoverable) or dedicated edit page (navigation overhead)

4. **State Management**
   - Decision: Use local component state with React hooks; Firestore listener for real-time sync
   - Rationale: Sufficient for category scope, avoids unnecessary complexity
   - Alternatives: Global context (overkill for this feature) or local storage (less reliable for multi-user)

5. **Routing**
   - Decision: Add `(home)/categories.tsx` as a new route within the home layout
   - Rationale: Matches existing structure (`clients.tsx`, `reports.tsx`, `settings.tsx`), groups related features
   - Alternatives: Separate admin section (lower discoverability)

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Real-time Firestore listener not cleaning up properly | Implement proper cleanup in useEffect dependencies; test with React Strict mode |
| Network latency causes stale UI state | Show optimistic updates with rollback on error; display loading states |
| Category name conflicts or duplicates | Add validation to prevent empty/duplicate names; document constraints in spec |
| Data loss on failed mutations | Store last-known good state; provide rollback UI option for delete operations |
| Firestore quota exhaustion from frequent updates | Debounce edit operations; batch updates where possible |

## Migration Plan

1. **Phase 1**: Create service layer and hook
2. **Phase 2**: Build modal components
3. **Phase 3**: Implement categories page and navigation
4. **Phase 4**: Add error handling and loading states
5. **Phase 5**: Write tests and documentation

**Rollback Strategy**: Feature flag the categories route; if issues arise, disable navigation link and revert commits.

## Open Questions

- Should categories support a `createdBy` user ID for audit purposes?
- Do we need a "default" or "uncategorized" category?
- Should there be a limit on the number of categories a user can create?
