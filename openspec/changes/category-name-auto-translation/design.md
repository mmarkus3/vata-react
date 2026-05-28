## Context

Category documents currently store the default Finnish category name in `name`. Product data already supports multilingual fields, and category names now need matching Swedish and English values for downstream multilingual display. The translation must happen in backend Firebase Functions because the frontend should not need to call translation services or manage service credentials.

`functions/package.json` already includes `@google-cloud/translate`, and existing Firestore triggers live under `functions/src/on-item`. The new trigger should follow the same exported-trigger pattern from `functions/src/index.ts`.

## Goals / Non-Goals

**Goals:**
- Add a Firestore `onDocumentWritten` trigger for `/categories/{categoryId}`.
- Translate category `name` to Swedish and English when a category is created or when `name` changes.
- Save translated values to `name_sv` and `name_en` on the category document.
- Skip work when the category is deleted, the name is missing, the name is unchanged and translations are present, or computed translations match existing fields.
- Keep writes Firestore-safe and avoid sending `undefined`.
- Add backend tests around trigger decision logic and translation result mapping.

**Non-Goals:**
- No frontend category form changes.
- No manual translation editing UI.
- No translation of category descriptions.
- No bulk backfill for old categories unless they are later written and need translations.
- No changes to external webshop/category API responses in this change.

## Decisions

1. Implement the trigger in a dedicated backend module, for example `functions/src/on-item/category-translation.ts`.
   - Rationale: Existing triggers use `functions/src/on-item`, and keeping translation logic separate makes it testable.
   - Alternative considered: Add logic to the frontend category service. Rejected because translation credentials and side effects belong server-side.

2. Use `onDocumentWritten` rather than separate create/update triggers.
   - Rationale: The user requested `onDocumentWritten`, and a single trigger can handle both create and update with one decision path.
   - Alternative considered: `onDocumentCreated` plus `onDocumentUpdated`. Rejected as duplicated trigger plumbing.

3. Translate only when the default `name` requires translation.
   - Rationale: Firestore trigger writes to the same document will re-trigger the function. Checking whether `name` changed and whether `name_sv`/`name_en` already exist prevents loops and unnecessary translation costs.
   - Alternative considered: Always translate on every write. Rejected due to cost, latency, and loop risk.

4. Isolate pure decision/mapping helpers for tests.
   - Rationale: Tests should verify behavior without making network calls to Google Translate.
   - Alternative considered: Only integration-test the deployed function. Rejected because it would be slower and harder to run locally.

## Risks / Trade-offs

- Translation write can retrigger the same function → Compare before/after names and existing translation fields before translating or writing.
- Google Translate can fail or be unavailable → Log the error and avoid blocking the original category create/update operation.
- Machine translations may be imperfect → Store backend-generated translations as defaults; manual overrides can be added in a later UI change if needed.
- Existing categories are not immediately backfilled → This avoids a migration task and translation burst; old categories can be translated on future writes or a separate backfill change.
