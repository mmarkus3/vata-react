## 1. Import Mapping

- [x] 1.1 Add a typed product JSON import mapping utility that consumes `ProductImport` and returns patches only for supported existing form fields and image URLs.
- [x] 1.2 Implement conservative mappings for name, GTIN/EAN, image references, country of origin, localized ingredient/description values, and compatible nutrition code/unit combinations.
- [x] 1.3 Ensure the mapper skips absent, malformed, unknown-unit, and source-only values without adding fields to `types/product.ts`.

## 2. Product Detail User Flow

- [x] 2.1 Add JSON file selection support to product detail edit mode using an Expo-compatible document picker and parse selected content safely.
- [x] 2.2 Apply imported field patches to the existing react-hook-form state without clearing unmatched values, and merge unique imported image URLs into current product images.
- [x] 2.3 Add localized import action, success/error feedback, and cancellation-safe behavior while preserving the existing manual save workflow.

## 3. Verification

- [x] 3.1 Add unit tests for complete and partial `ProductImport` mappings, nutrient code/unit handling, image merging, and ignored source-only properties.
- [x] 3.2 Add product detail interaction coverage for successful import and invalid JSON handling without unintended form mutation or persistence.
- [x] 3.3 Run relevant frontend tests and TypeScript validation, confirming that `types/product.ts` remains unchanged by the feature.
