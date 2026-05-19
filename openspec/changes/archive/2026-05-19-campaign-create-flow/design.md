## Context

The app now exposes campaigns in navigation and list view, but lacks creation workflows. Campaign creation must support two promotional modes (code-based and auto-applied), date windows, company scoping, flexible targeting, and discount type selection while matching existing app conventions for forms and Firestore writes.

## Goals / Non-Goals

**Goals:**
- Provide a campaign creation flow available to authenticated company users.
- Persist campaign with `company` derived from `user.profile.company`.
- Enforce and represent campaign mode behavior:
  - with code -> apply at checkout
  - without code -> apply immediately for campaign products
- Support targeting modes: selected products, all products, all products in category.
- Support discount types: percentage and fixed price.
- Persist start/end timestamps and validate range.

**Non-Goals:**
- Implementing full checkout engine in this change (only campaign behavior contract and required data).
- Analytics/reporting for campaign performance.
- Advanced stacking/combinability rules across multiple campaigns.

## Decisions

- Introduce a dedicated campaign-create form state module to keep validation logic testable.
- Store campaign ownership using authenticated company ID only; user cannot override company.
- Represent targeting mode explicitly in campaign payload (`selected`, `all_products`, `category`) plus relevant selectors.
- Keep discount payload mutually exclusive based on type:
  - `percentage` uses percentage value against retail price
  - `price` uses fixed target price
- Persist start/end as Firestore-compatible timestamps/dates and validate `end > start`.
- Include optional `code`; when omitted, campaign is treated as auto-applied by downstream consumers.

## Risks / Trade-offs

- [Scope ambiguity in auto-apply behavior] No-code application might be interpreted differently by webshop runtime -> Define explicit mode fields in payload to avoid implicit behavior.
- [Large product selection] Selecting all products dynamically can be expensive if expanded client-side -> Prefer storing targeting mode rather than expanding into huge product arrays when possible.
- [Validation complexity] Multiple targeting and discount modes increase invalid combination risk -> Centralize validation with deterministic unit tests.
- [Data compatibility] Existing campaign type may need extension for targeting fields -> Update type definitions and guard migrations with fallbacks.
