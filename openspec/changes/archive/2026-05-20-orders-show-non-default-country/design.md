## Context

Orders list and detail pages already show core metadata (status, products, delivery info). Country exists in order data flow but is not explicitly surfaced. Requirement is presentation-only and conditional: show country only for non-default values to avoid noise.

## Goals / Non-Goals

**Goals:**
- Display order country in list and detail views when value exists and is not `FI`.
- Keep FI/default-country UI unchanged.
- Keep behavior consistent across list and detail.

**Non-Goals:**
- No backend schema or API contract changes.
- No additional filtering/grouping by country.
- No redesign of existing order cards/layout beyond adding country text.

## Decisions

- Normalize country checks by treating `FI` as default hidden value.
- Render country row/label only when `country` is non-empty and uppercased value differs from `FI`.
- Reuse existing i18n keys pattern for labels and fallback formatting.

## Risks / Trade-offs

- [Risk] Country code casing inconsistencies (`fi`, `Fi`). -> Mitigation: normalize to uppercase in display check.
- [Trade-off] Slightly denser non-FI cards/detail views. -> Mitigation: keep compact single-line field.
- [Risk] Missing country values in old orders. -> Mitigation: conditional rendering already hides absent values.
