## Context

Campaign fixed-price flows already support per-product line values in create and edit modals. This solved mixed-price campaigns, but it increased manual input effort for common campaigns where all targeted products share one fixed price. The UI now needs a fast bulk-fill control without removing line-by-line editing or changing payload structure.

## Goals / Non-Goals

**Goals:**
- Add one shared fixed-price input that can populate all targeted product fixed-price fields in create and edit.
- Preserve current per-product fields as source of truth for validation and payload mapping.
- Keep behavior deterministic when targeting scope changes (selected/all/category).

**Non-Goals:**
- No backend contract changes.
- No removal of per-product fixed-price inputs.
- No automatic locking of line values after bulk apply; users can still override each line.

## Decisions

- Add a dedicated bulk value UI control in fixed-price mode above per-product line inputs, with an explicit apply action.
  - Rationale: explicit apply avoids accidental overwrites while still being fast.
  - Alternative considered: live mirroring while typing; rejected because it makes per-line overrides fragile.
- Keep `discountFixedValues[productId]` as canonical state and only use bulk input to write into that map for currently targeted products.
  - Rationale: avoids dual-source validation and keeps payload mapping unchanged.
- Preserve existing synchronization behavior so stale product IDs are removed from `discountFixedValues` when targeting changes.
  - Rationale: prevents hidden invalid state and avoids sending irrelevant values.
- Reuse existing validation key for invalid fixed values.
  - Rationale: no new translation dependency required for initial rollout.

## Risks / Trade-offs

- [Risk] Users may assume bulk apply updates future selections automatically. -> Mitigation: scope bulk apply to “currently targeted products” and keep explicit per-line visibility.
- [Risk] Accidental overwrite of manually tuned line values. -> Mitigation: explicit apply action and ability to edit line values immediately after apply.
- [Trade-off] One extra control increases modal density. -> Mitigation: show bulk control only in fixed-price mode.
