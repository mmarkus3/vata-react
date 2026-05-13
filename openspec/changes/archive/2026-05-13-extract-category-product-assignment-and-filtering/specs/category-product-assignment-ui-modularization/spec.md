## ADDED Requirements

### Requirement: Category assignment UI is implemented as a dedicated module
The system SHALL implement category-page product assignment UI and state handling in dedicated component/module files instead of embedding full logic in category detail page file.

#### Scenario: Category page delegates assignment flow
- **WHEN** category detail renders add-products action
- **THEN** the assignment modal/flow is rendered via a dedicated assignment component/module
- **AND** category detail interacts through explicit props or callbacks

#### Scenario: Assignment module owns filter and selection state
- **WHEN** users search, select, deselect, or submit assignments
- **THEN** these interactions are managed inside assignment module boundaries with clear outputs to the parent page

#### Scenario: Assignment module remains behavior-compatible
- **WHEN** assignment succeeds or fails
- **THEN** user-visible outcomes remain consistent with existing assignment behavior (loading guard, success message, retryable error)
