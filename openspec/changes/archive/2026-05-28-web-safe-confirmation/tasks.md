## 1. Shared Confirmation API

- [x] 1.1 Add a shared confirmation helper under the common UI layer that accepts title, message, cancel text, confirm text, destructive flag and confirm callback.
- [x] 1.2 Implement native behavior with React Native `Alert.alert`.
- [x] 1.3 Implement web behavior with `Platform.OS === 'web'` and guarded `window.confirm`.

## 2. Call Site Migration

- [x] 2.1 Replace direct `Alert.alert` usage in product deletion with the shared confirmation helper.
- [x] 2.2 Replace direct `Alert.alert` usage in campaign deletion with the shared confirmation helper.
- [x] 2.3 Replace direct `Alert.alert` usage in category deletion with the shared confirmation helper.

## 3. Verification

- [x] 3.1 Add unit tests for native alert behavior and web confirm accepted/cancelled behavior.
- [x] 3.2 Add or update focused tests that protect migrated delete call sites from using direct `Alert.alert` where practical.
- [x] 3.3 Run focused tests, lint changed files, and verify Expo web export still bundles.
