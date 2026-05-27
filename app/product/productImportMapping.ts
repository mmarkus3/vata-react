import type { ProductDetailFormValues } from '@/app/product/productDetailForm';
import type {
  ProductImport,
  ProductImportLocalizedValue,
  ProductImportMeasurement,
  ProductImportNutrientDetail,
  ProductImportReferencedFile,
} from '@/types/productImport';
import { getCountryNameFromNumericCode } from '@/utils/countryName';

type ImportedFormField =
  | 'name'
  | 'ean'
  | 'countryOfOrigin'
  | 'ingredients_fi'
  | 'ingredients_sv'
  | 'ingredients_en'
  | 'description_fi'
  | 'description_sv'
  | 'description_en'
  | 'energyJoule'
  | 'energyCalory'
  | 'fat'
  | 'saturatedFat'
  | 'carbohydrate'
  | 'saturatedCarbohydrate'
  | 'protein'
  | 'salt'
  | 'fiber';

export interface ProductImportMapping {
  formValues: Partial<Pick<ProductDetailFormValues, ImportedFormField>>;
  imageUrls: string[];
}

const nutrientMappings: Record<string, { field: ImportedFormField; units: string[] }> = {
  FAT: { field: 'fat', units: ['GRM', 'G'] },
  FASAT: { field: 'saturatedFat', units: ['GRM', 'G'] },
  CHOAVL: { field: 'carbohydrate', units: ['GRM', 'G'] },
  'SUGAR-': { field: 'saturatedCarbohydrate', units: ['GRM', 'G'] },
  'PRO-': { field: 'protein', units: ['GRM', 'G'] },
  SALTEQ: { field: 'salt', units: ['GRM', 'G'] },
  FIBTG: { field: 'fiber', units: ['GRM', 'G'] },
};

const languageAliases: Record<string, string[]> = {
  fi: ['fi', 'fin'],
  sv: ['sv', 'swe'],
  en: ['en', 'eng'],
};

const toArray = <T>(value: T[] | undefined): T[] => (Array.isArray(value) ? value : []);

const getLocalizedValue = (values: ProductImportLocalizedValue[] | undefined, language: keyof typeof languageAliases): string | undefined => {
  const aliases = languageAliases[language];
  const match = toArray(values).find((value) => aliases.includes(value.LanguageCode?.toLowerCase().split('-')[0]));
  const text = match?.Value?.trim();
  return text || undefined;
};

const getPreferredName = (
  regulatedNames: ProductImportLocalizedValue[] | undefined,
  descriptions: ProductImportLocalizedValue[] | undefined,
  functionalNames: ProductImportLocalizedValue[] | undefined
): string | undefined => {
  const sources = [regulatedNames, descriptions, functionalNames];
  for (const values of sources) {
    const finnishValue = getLocalizedValue(values, 'fi');
    if (finnishValue) return finnishValue;
  }

  for (const values of sources) {
    const firstValue = toArray(values).find((value) => Boolean(value.Value?.trim()))?.Value?.trim();
    if (firstValue) return firstValue;
  }

  return undefined;
};

const getQuantity = (detail: ProductImportNutrientDetail, units: string[]): ProductImportMeasurement | undefined =>
  toArray(detail.QuantityContained).find(
    (quantity) => units.includes(quantity.MeasurementUnitCode?.toUpperCase()) && Number.isFinite(quantity.Value)
  );

const setStringValue = (
  values: ProductImportMapping['formValues'],
  field: ImportedFormField,
  value: string | undefined
) => {
  if (value) values[field] = value;
};

const isImageUrl = (file: ProductImportReferencedFile): boolean =>
  file.MimeType?.toLowerCase().startsWith('image/')
  && /^https?:\/\//i.test(file.UniformResourceIdentifier?.trim());

export const parseProductImportJson = (text: string): ProductImport => {
  const parsed: unknown = JSON.parse(text);
  if (
    typeof parsed !== 'object'
    || parsed === null
    || !('TradeItem' in parsed)
    || typeof parsed.TradeItem !== 'object'
    || parsed.TradeItem === null
  ) {
    throw new Error('Invalid product import JSON');
  }

  return parsed as ProductImport;
};

export const mapProductImport = (imported: ProductImport): ProductImportMapping => {
  const tradeItem = imported.TradeItem;
  const descriptionInformation = tradeItem.TradeItemDescriptionModule?.TradeItemDescriptionInformation;
  const ingredientStatements = tradeItem.FoodAndBeverageIngredientModule?.IngredientStatement;
  const marketingMessages = tradeItem.MarketingInformationModule?.MarketingInformation?.TradeItemMarketingMessage;
  const formValues: ProductImportMapping['formValues'] = {};

  setStringValue(
    formValues,
    'name',
    getPreferredName(
      descriptionInformation?.RegulatedProductName,
      descriptionInformation?.TradeItemDescription,
      descriptionInformation?.FunctionalName
    )
  );
  setStringValue(formValues, 'ean', tradeItem.Gtin?.trim());
  setStringValue(
    formValues,
    'countryOfOrigin',
    getCountryNameFromNumericCode(
      toArray(tradeItem.PlaceOfItemActivityModule?.PlaceOfProductActivity?.CountryOfOrigin)[0]?.CountryCode?.Value
    )
  );

  for (const language of ['fi', 'sv', 'en'] as const) {
    setStringValue(formValues, `ingredients_${language}`, getLocalizedValue(ingredientStatements, language));
    setStringValue(formValues, `description_${language}`, getLocalizedValue(marketingMessages, language));
  }

  const nutrientDetails = toArray(tradeItem.NutritionalInformationModule?.NutrientHeader)
    .flatMap((header) => toArray(header.NutrientDetail));

  for (const detail of nutrientDetails) {
    const code = detail.NutrientTypeCode?.Value?.toUpperCase();
    if (code === 'ENER-') {
      const joules = getQuantity(detail, ['KJO', 'KJ']);
      const calories = getQuantity(detail, ['KCA', 'KCAL', 'E14']);
      if (joules) formValues.energyJoule = String(joules.Value);
      if (calories) formValues.energyCalory = String(calories.Value);
      continue;
    }

    const mapping = nutrientMappings[code];
    if (!mapping) continue;
    const quantity = getQuantity(detail, mapping.units);
    if (quantity) formValues[mapping.field] = String(quantity.Value);
  }

  const images = toArray(tradeItem.ReferencedFileDetailInformationModule?.ReferencedFileHeader)
    .filter(isImageUrl)
    .sort((left, right) => Number(right.IsPrimaryFile?.toLowerCase() === 'true') - Number(left.IsPrimaryFile?.toLowerCase() === 'true'))
    .map((file) => file.UniformResourceIdentifier.trim());

  return { formValues, imageUrls: [...new Set(images)] };
};

export const mergeImportedImageUrls = (existing: string[], imported: string[]): string[] =>
  [...new Set([...imported, ...existing])];
