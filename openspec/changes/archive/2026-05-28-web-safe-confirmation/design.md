## Context

Several destructive flows currently call `Alert.alert` directly: product deletion, campaign deletion and category deletion. React Native alert behavior is appropriate on native targets, but web builds need a browser-backed confirmation path. The app already uses `Platform.OS` in a few UI places, so a platform-specific helper fits existing patterns without introducing another dependency.

## Goals / Non-Goals

**Goals:**
- Provide one shared confirmation API for destructive confirmations.
- Use `window.confirm` when `Platform.OS === 'web'`.
- Preserve React Native `Alert.alert` behavior on native targets.
- Migrate current delete confirmation call sites away from direct `Alert.alert`.
- Keep confirmation call sites easy to read and test.

**Non-Goals:**
- No custom modal design for confirmations in this change.
- No replacement of non-confirmation alerts or error messages.
- No browser polyfill beyond guarding `window.confirm` usage.
- No changes to the delete business logic beyond confirmation routing.

## Decisions

1. Implement a helper function instead of a rendered modal component.
Rationale: the requested behavior is platform dispatch between native `Alert.alert` and web `window.confirm`; callers only need to provide title/message/buttons/callbacks. A function keeps existing delete handlers simple.
Alternative considered: a reusable confirmation modal component. Rejected because it would require screen-level state and would not preserve native alert behavior.

2. Model the helper around the existing two-action confirmation shape: cancel action and confirm action.
Rationale: all current call sites are destructive confirmations with a cancel and confirm option. This keeps the API small and focused.
Alternative considered: support arbitrary button arrays like `Alert.alert`. Rejected for now because it makes the web behavior ambiguous and is unnecessary for current usage.

3. Guard web usage with `Platform.OS === 'web'` and `typeof window !== 'undefined'`.
Rationale: tests and SSR-like environments may not expose `window`; native code should never attempt to access it.
Alternative considered: call `window.confirm` directly. Rejected because it would break non-browser test/runtime environments.

4. Return no promise from the helper and execute callbacks synchronously from the selected path.
Rationale: existing `Alert.alert` call sites are callback-driven. Keeping that model minimizes migration risk.
Alternative considered: make the helper async and return a boolean. Rejected because it would make native `Alert.alert` harder to model cleanly.

## Risks / Trade-offs

- [Risk] `window.confirm` has browser-native styling and cannot use localized button labels. -> Mitigation: localized title/message still communicate the decision; native keeps localized action labels.
- [Risk] A missing `window.confirm` in a non-browser web-like test environment could make confirmations fail silently. -> Mitigation: guard the call and treat unavailable confirmation as cancel.
- [Risk] Future confirmation flows might need more than two buttons. -> Mitigation: keep this helper focused and add a richer API only when a real use case appears.
