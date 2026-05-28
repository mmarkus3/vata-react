## Why

React Native `Alert.alert` does not provide the same confirmation behavior on web, so destructive actions that rely on it can fail or become inconsistent in the Expo web build. A shared confirmation utility can preserve native behavior while using `window.confirm` on web.

## What Changes

- Add a reusable cross-platform confirmation helper/component API.
- Use `Platform.OS === 'web'` to call `window.confirm` for web confirmation prompts.
- Use React Native `Alert.alert` for native platforms.
- Migrate current destructive confirmation call sites for product delete, campaign delete, and category delete to the shared confirmation API.
- Add tests for native and web confirmation behavior, including confirm and cancel paths.

## Capabilities

### New Capabilities
- `cross-platform-confirmation`: Provide a reusable confirmation API that works on native and web targets.

### Modified Capabilities

## Impact

- Affected code: a new shared confirmation helper/component, `app/product/[id].tsx`, `app/campaign/[id].tsx`, `app/category/[id].tsx`, and focused tests.
- Runtime behavior: web uses `window.confirm`; native keeps React Native `Alert.alert`.
- Dependencies: no new external dependency is expected.
