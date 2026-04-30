## Context

The client detail page currently displays both fullfilment views (by month and by product) simultaneously, which can be overwhelming on mobile devices and takes up significant screen space. Users need a way to focus on one view at a time while maintaining easy access to both.

Current state:
- Both fullfilment views are always visible
- No user control over which view to prioritize
- Screen space is used inefficiently on mobile
- Data loading happens for both views regardless of user preference

## Goals / Non-Goals

**Goals:**
- Add a segment control to switch between fullfilment views
- Show only the active view to save screen space
- Maintain existing data loading and error handling
- Keep the design consistent with the app's UI patterns
- Ensure accessibility and touch targets meet guidelines

**Non-Goals:**
- Change the data structure or grouping logic
- Add filtering or sorting capabilities
- Modify the client information display
- Add persistence of user's view preference

## Decisions

### Segment Control Implementation
**Decision:** Custom tab-based segment control using TouchableOpacity components with NativeWind styling.

**Rationale:** Provides full control over styling and behavior, ensures consistency with the app's design system, and works across all platforms (iOS, Android, Web).

**Alternatives Considered:**
- SegmentedControlIOS: iOS-only, wouldn't work on Android/Web
- Third-party libraries: Would add dependencies and potential styling conflicts
- React Native's built-in tabs: Less flexible for custom styling

### State Management
**Decision:** Local component state with useState for the active tab index.

**Rationale:** Simple, self-contained state management that doesn't require additional libraries. The component is not complex enough to warrant global state management.

**Alternatives Considered:**
- Context API: Overkill for single component state
- Redux/Zustand: Too heavy for this use case

### View Structure
**Decision:** Conditional rendering based on active tab, with shared data loading logic.

**Rationale:** Keeps the data fetching logic in one place while allowing different presentations. Maintains performance by not duplicating API calls.

**Alternatives Considered:**
- Separate components for each view: Would duplicate loading/error states
- Always render both views (hidden): Worse performance and memory usage

## Risks / Trade-offs

**Increased component complexity** → Mitigation: Keep the segment control as a simple, focused component with clear separation of concerns

**Potential accessibility issues with custom tabs** → Mitigation: Ensure proper touch targets (minimum 44x44pt), clear visual feedback, and semantic labeling

**State management edge cases** → Mitigation: Initialize with sensible default (month view first), handle loading states properly