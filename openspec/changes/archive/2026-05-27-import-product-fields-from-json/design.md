## Context

The product detail page edits an existing `Product` through `ProductDetailFormValues` and maintains images as adjacent screen state. A detailed trade-item payload is now represented by `types/productImport.ts`, including localized product text, GTIN, media references, origin and nutrient data. Much of the payload has no destination in the current `Product` interface, and the requested import must not expand that interface.

The feature affects JSON file selection in an Expo/React Native UI, typed parsing/mapping logic, react-hook-form state population, image state population, localized feedback and frontend tests. Imported values are staged in edit state and are persisted only if the user saves through the existing update workflow.

## Goals / Non-Goals

**Goals:**
- Allow a user editing a product to choose a JSON file and prefill usable existing product fields from a `ProductImport` payload.
- Centralize import parsing and mapping outside of the screen component so the mapping is deterministic and unit-testable.
- Preserve current user-entered or saved values whenever no valid imported counterpart is present.
- Make the mapping explicit and conservative, using only existing `Product` fields and their current UI semantics.

**Non-Goals:**
- No additions or changes to the `Product` interface or Firestore product document schema.
- No import of source-only allergen, packaging, classification, tax, physical measurement, marketing, lifespan, party, contact, or trade-channel data.
- No import of price, stock amount, category, webshop visibility, or barcode fields because the payload does not provide an equivalent value with the current application meaning.
- No backend processing, automatic save, bulk import, or product creation import in this change.

## Decisions

1. Offer import from product detail edit mode and stage imported values in existing form/image state.
Rationale: users can review imported data before the established save path modifies Firestore, and no separate persistence behavior is needed.
Alternative considered: automatically update the document after file selection. Rejected because it could persist incorrectly mapped external data without review.

2. Add a focused import mapper that accepts parsed `ProductImport` data and returns only supported patches for the existing form and images.
Rationale: a pure mapper is straightforward to test against sample payloads and prevents `types/product.ts` from becoming a mirror of the external trade-item schema.
Alternative considered: map nested JSON directly in `app/product/[id].tsx`. Rejected because parsing rules and nutrient code handling would make the screen harder to maintain.

3. Use the following conservative mapping into existing values:

| Existing destination | Source value | Rule |
| --- | --- | --- |
| `name` | localized regulated/product description fields | Prefer Finnish `RegulatedProductName`, then Finnish trade-item/functional description, then the first usable description value. |
| `ean` | `Gtin` | Fill with a non-empty GTIN. Do not map into `barcode`, whose existing flow supports barcode input/image behavior. |
| `images` | `ReferencedFileHeader[].UniformResourceIdentifier` | Merge unique valid image media URLs into current image state, putting marked primary media first without removing existing images. |
| `countryOfOrigin` | first `CountryOfOrigin[].CountryCode.Value` | Fill when non-empty. |
| `ingredients_fi`, `ingredients_sv`, `ingredients_en` | localized `IngredientStatement` entries | Match language codes case-insensitively for Finnish, Swedish and English. |
| `description_fi`, `description_sv`, `description_en` | localized `TradeItemDescription` entries | Match language codes case-insensitively; use imported localized product descriptions rather than source-only marketing content. |
| `energyJoule` / `energyCalory` | nutrient `ENER-` quantities | Fill only quantities carrying the expected kJ or kcal measurement unit. |
| `fat`, `saturatedFat`, `carbohydrate`, `saturatedCarbohydrate`, `protein`, `salt`, `fiber` | `FAT`, `FASAT`, `CHOAVL`, `SUGAR-`, `PRO-`, `SALTEQ`, `FIBTG` | Fill numeric quantities in grams; `SUGAR-` matches the existing UI label for `saturatedCarbohydrate`. |

Rationale: each destination already exists and has an equivalent representation in the imported trade-item data. Unit checks prevent assigning incompatible measurements to the form.
Alternative considered: store every payload value or infer price/stock fields. Rejected because those values are not present as semantically equivalent existing product fields.

4. Parse a JSON-only selected file through a document picker boundary and provide localized failures for cancellation-free parse/type errors.
Rationale: a selected external file is untrusted input; invalid JSON or a missing `TradeItem` structure must not reset or partially corrupt form values.
Alternative considered: allow free-form pasted JSON. Rejected because selecting the supplier file is the intended workflow and offers a cleaner mobile interaction.

5. Apply patches only for usable imported values and retain all other current state.
Rationale: partial supplier payloads are expected, and clearing existing fields on missing data would be destructive.
Alternative considered: reset the entire form from import defaults. Rejected because it would remove manually maintained product information not present in the payload.

## Risks / Trade-offs

- [Risk] External payload variants may use additional nutrient codes or units not initially recognized. -> Mitigation: skip unknown values safely and cover known mappings with unit tests; additional mappings can be added without changing the product model.
- [Risk] An imported value overwrites an unsaved field that the user typed before importing. -> Mitigation: make import an explicit edit-mode action and keep saving user-controlled so changed values remain reviewable.
- [Risk] Remote referenced images may later become inaccessible. -> Mitigation: preserve existing images and only merge well-formed image media URLs rather than replacing current media.
- [Risk] Document picker behavior differs between native and web builds. -> Mitigation: use Expo-compatible file selection and test successful selection, cancellation, and invalid-file handling.

## Migration Plan

1. Add the picker and import mapping utility behind the product detail edit-mode UI.
2. Add localized labels/messages and mapping/UI tests.
3. Release without data migration because imports use existing form submission and existing product fields only.
4. Roll back by removing the import control and mapper; no imported-only persisted schema needs cleanup.

## Open Questions

- None for the initial implementation; additional external fields can be evaluated later only if the application first defines corresponding product destinations.
