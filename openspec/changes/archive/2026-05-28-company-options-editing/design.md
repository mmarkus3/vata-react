## Context

The app already uses company-scoped options from Firestore at `options/{companyId}` for VAT, delivery pricing, payment provider credentials, notification email, and cached currency rates. The backend owns the currency-rate cache lifecycle, while users need a frontend page to inspect and update the editable company settings.

The existing overflow menu contains secondary pages such as categories, campaigns, and profile/settings. Company options fit this same navigation pattern because they are an administrative page, not a primary day-to-day tab.

## Goals / Non-Goals

**Goals:**
- Add an overflow menu page for company options.
- Fetch options for the signed-in user's `profile.company` from `options/{companyId}`.
- Let the user edit supported fields: delivery price, free-delivery threshold, VAT, notification email, and VismaPay credentials when present in the model.
- Save only editable fields and never send `undefined` to Firestore.
- Keep `currencyRate` hidden from the UI and preserved in Firestore.
- Provide localized loading, empty, validation, success, and error states.

**Non-Goals:**
- No backend API changes; the management app should use Firebase client-side reads and writes.
- No changes to the `Options` data model shape for `currencyRate`.
- No manual editing of the currency-rate cache.
- No new payment-provider setup flow beyond editing existing option fields.

## Decisions

1. Use an overflow menu route for the options page.
   - Rationale: options are administrative settings, similar in weight to profile and categories, and should not displace the primary tabs.
   - Alternative considered: always-visible tab. Rejected because the user explicitly asked for a new page under the menu.

2. Add a small `services/options.ts` client service.
   - Rationale: Firestore read/write details should stay out of the screen, and tests can verify payload sanitization and `currencyRate` preservation behavior.
   - Alternative considered: inline Firestore calls in the page. Rejected because options are shared business data and likely to grow.

3. Save editable fields with `setDoc(..., { merge: true })` or equivalent merge semantics.
   - Rationale: merge updates avoid replacing system-managed fields like `currencyRate` and tolerate future options fields.
   - Alternative considered: write the whole document after filtering `currencyRate`. Rejected because it risks deleting unknown future fields.

4. Treat numeric inputs as strings in UI and convert on save.
   - Rationale: React Native text inputs work best with strings, while Firestore and backend consumers expect numbers.
   - Alternative considered: store form values as numbers throughout. Rejected because empty and partially typed values are awkward to represent without accidental `undefined` writes.

## Risks / Trade-offs

- Invalid numeric settings could break checkout pricing → Validate required numeric fields before saving and keep users on the form with localized errors.
- Secret-like VismaPay fields are editable in the app → Do not add extra exposure beyond the existing `options/{companyId}` data; use current auth and Firestore rules as the access boundary.
- Existing option documents might be missing optional fields → Render empty fields safely and write only fields the user submits.
