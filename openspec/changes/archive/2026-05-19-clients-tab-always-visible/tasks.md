## 1. Primary Tab Visibility

- [x] 1.1 Update home tabs config so `clients` is visible in primary tab bar.
- [x] 1.2 Confirm tab labels/icons for `Asiakkaat` still use existing i18n and style patterns.

## 2. Overflow Menu Update

- [x] 2.1 Remove `Asiakkaat` from overflow menu item configuration.
- [x] 2.2 Keep overflow navigation behavior intact for `Kategoriat`, `Kampanjat`, and `Profiili`.

## 3. Verification

- [x] 3.1 Update tab configuration tests to assert `clients` is visible and no longer hidden.
- [x] 3.2 Update overflow menu tests to assert clients is not listed and remaining routes still match.
- [x] 3.3 Run targeted home-tabs/overflow test suite and resolve regressions.
