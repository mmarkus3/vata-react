## 1. Campaign Service

- [x] 1.1 Add `deleteCampaign(campaignId)` to `services/campaign.ts` using the shared Firestore `deleteItem` helper.
- [x] 1.2 Add focused service tests covering successful campaign deletion and mapped deletion errors.

## 2. Campaign Detail UI

- [x] 2.1 Add delete state and confirmation handling to `app/campaign/[id].tsx`.
- [x] 2.2 Render a localized destructive delete action on campaign detail and disable it while deletion is in progress.
- [x] 2.3 Navigate back to `/(home)/campaigns` after successful deletion and keep the user on detail with localized feedback on failure.

## 3. Verification

- [x] 3.1 Add/update campaign detail state tests for delete action availability or disabled state helpers if helper logic is extracted.
- [x] 3.2 Add Finnish and English translations for campaign delete labels, confirmation and errors.
- [x] 3.3 Run focused campaign tests and relevant lint/type checks.
