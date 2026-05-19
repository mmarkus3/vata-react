## Why

Campaign list currently provides summary rows but users cannot open a dedicated detail view for full campaign information. A campaign detail page improves campaign review, troubleshooting, and validation before or during active promotions.

## What Changes

- Add campaign detail page requirements under campaign workflows.
- Define navigation from campaigns list to campaign detail page.
- Define campaign detail content sections (core metadata, timing, targeting, discount, and selected products where relevant).

## Capabilities

### New Capabilities
- `campaign-detail`: Campaign detail route and detailed campaign information rendering.

### Modified Capabilities
- `campaign-list`: Campaign rows support opening campaign detail page.

## Impact

- Affected frontend likely includes campaigns list screen, new campaign detail route/screen, and campaign data fetching by ID.
- i18n keys required for campaign detail labels and state messages.
- Tests should cover route construction, detail-state handling, and key field rendering/fallbacks.
