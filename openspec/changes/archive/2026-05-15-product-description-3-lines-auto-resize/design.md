## Context

Product description editing uses multiline text inputs in the product form flow, but the current behavior does not explicitly guarantee a comfortable default editing height or dynamic growth as users add lines. We need a consistent UI rule for description inputs so editing longer content is easier without introducing API or data model changes.

## Goals / Non-Goals

**Goals:**
- Ensure product description editing starts with a visible 3-line text area.
- Ensure the input height automatically expands as users type additional lines.
- Keep behavior modular so shared input/form components can enforce consistent UX.

**Non-Goals:**
- Changing product description validation rules or persistence format.
- Altering Firestore schema, payload shape, or backend workflows.
- Redesigning unrelated form sections or modal/page layouts.

## Decisions

- Use multiline text input configuration with a `numberOfLines` default of 3 for product description fields.
Rationale: This creates a predictable minimum editing affordance and maps directly to native React Native text input behavior.
Alternative considered: fixed pixel height only. Rejected because it is less adaptive across platforms/font scaling.

- Drive auto-resize from content-size change events and update the rendered height with a minimum that equals the 3-line baseline.
Rationale: This supports natural growth for long descriptions while preserving the default layout for short values.
Alternative considered: leaving overflow with internal scrolling. Rejected because it hides content during editing and increases friction.

- Scope the change to description editing surfaces only (not all multiline fields globally).
Rationale: Limits regression risk and matches the requested UX change.
Alternative considered: apply to every multiline input. Rejected to avoid broad, unrequested UI changes.

## Risks / Trade-offs

- [Platform differences in text measurement] -> Mitigation: clamp to minimum baseline and rely on content-size callbacks already supported in target platforms.
- [Potential layout shift in dense forms as the field grows] -> Mitigation: keep growth vertical within scrollable form containers and validate behavior on mobile + web breakpoints.
- [Shared component side effects] -> Mitigation: gate behavior behind props used only by description fields if the shared input is reused elsewhere.
