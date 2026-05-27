import {
  mapProductImport,
  mergeImportedImageUrls,
  parseProductImportJson,
} from '@/app/product/productImportMapping';
import type { ProductImport } from '@/types/productImport';

const makeImport = (): ProductImport => ({
  TradeItem: {
    Gtin: '06430080880058',
    TradeItemDescriptionModule: {
      TradeItemDescriptionInformation: {
        RegulatedProductName: [{ LanguageCode: 'fi', Value: 'Hedelmakarkki' }],
        FunctionalName: [],
        TradeItemDescription: [
          { LanguageCode: 'fi', Value: 'Suomalainen hedelmakarkki' },
          { LanguageCode: 'sv', Value: 'Finskt fruktgodis' },
          { LanguageCode: 'en', Value: 'Finnish fruit candy' },
        ],
        DescriptionShort: [],
        BrandNameInformation: { BrandName: 'Test' },
      },
    },
    FoodAndBeverageIngredientModule: {
      IngredientStatement: [
        { LanguageCode: 'fi', Value: 'sokeri, omena' },
        { LanguageCode: 'sv', Value: 'socker, apple' },
        { LanguageCode: 'en-GB', Value: 'sugar, apple' },
      ],
    },
    MarketingInformationModule: {
      MarketingInformation: {
        TradeItemMarketingMessage: [
          { LanguageCode: 'fi', Value: 'Iloinen makuhetki koko perheelle' },
          { LanguageCode: 'sv', Value: 'En glad smakstund for hela familjen' },
          { LanguageCode: 'en', Value: 'A joyful treat for the whole family' },
        ],
      },
    },
    PlaceOfItemActivityModule: {
      ImportClassification: [],
      PlaceOfProductActivity: {
        CountryOfOrigin: [{ CountryCode: { Value: '428' } }],
      },
    },
    NutritionalInformationModule: {
      NutrientHeader: [{
        PreparationStateCode: { Value: 'UNPREPARED' },
        NutrientBasisQuantity: { MeasurementUnitCode: 'GRM', Value: 100 },
        NutrientDetail: [
          {
            NutrientTypeCode: { Value: 'ENER-' },
            MeasurementPrecisionCode: { Value: 'EXACT' },
            QuantityContained: [
              { MeasurementUnitCode: 'KJO', Value: 1470 },
              { MeasurementUnitCode: 'KCA', Value: 351 },
            ],
          },
          {
            NutrientTypeCode: { Value: 'FAT' },
            MeasurementPrecisionCode: { Value: 'EXACT' },
            QuantityContained: [{ MeasurementUnitCode: 'GRM', Value: 1.24 }],
          },
          {
            NutrientTypeCode: { Value: 'SUGAR-' },
            MeasurementPrecisionCode: { Value: 'EXACT' },
            QuantityContained: [{ MeasurementUnitCode: 'GRM', Value: 76.79 }],
          },
          {
            NutrientTypeCode: { Value: 'FIBTG' },
            MeasurementPrecisionCode: { Value: 'EXACT' },
            QuantityContained: [{ MeasurementUnitCode: 'GRM', Value: 3.08 }],
          },
        ],
      }],
    },
    ReferencedFileDetailInformationModule: {
      ReferencedFileHeader: [
        {
          MimeType: 'image/jpeg',
          UniformResourceIdentifier: 'https://example.com/alternate.jpg',
          IsPrimaryFile: 'false',
        },
        {
          MimeType: 'image/jpeg',
          UniformResourceIdentifier: 'https://example.com/main.jpg',
          IsPrimaryFile: 'true',
        },
        {
          MimeType: 'application/pdf',
          UniformResourceIdentifier: 'https://example.com/sheet.pdf',
          IsPrimaryFile: 'false',
        },
      ],
    },
    PackagingInformationModule: {
      Packaging: [],
    },
  },
} as unknown as ProductImport);

describe('productImportMapping', () => {
  it('maps supported product detail values without source-only fields', () => {
    const mapped = mapProductImport(makeImport());

    expect(mapped.formValues).toEqual({
      name: 'Hedelmakarkki',
      ean: '06430080880058',
      countryOfOrigin: 'Latvia',
      ingredients_fi: 'sokeri, omena',
      description_fi: 'Iloinen makuhetki koko perheelle',
      ingredients_sv: 'socker, apple',
      description_sv: 'En glad smakstund for hela familjen',
      ingredients_en: 'sugar, apple',
      description_en: 'A joyful treat for the whole family',
      energyJoule: '1470',
      energyCalory: '351',
      fat: '1.24',
      saturatedCarbohydrate: '76.79',
      fiber: '3.08',
    });
    expect(mapped.formValues).not.toHaveProperty('PackagingInformationModule');
    expect(mapped.formValues).not.toHaveProperty('price');
    expect(mapped.formValues.description_fi).not.toBe('Suomalainen hedelmakarkki');
    expect(mapped.imageUrls).toEqual([
      'https://example.com/main.jpg',
      'https://example.com/alternate.jpg',
    ]);
  });

  it('leaves absent and incompatible values out of a partial import patch', () => {
    const imported = makeImport();
    imported.TradeItem.Gtin = '';
    imported.TradeItem.PlaceOfItemActivityModule.PlaceOfProductActivity.CountryOfOrigin = [{ CountryCode: { Value: '999' } }];
    imported.TradeItem.NutritionalInformationModule.NutrientHeader[0].NutrientDetail = [{
      NutrientTypeCode: { Value: 'FAT' },
      MeasurementPrecisionCode: { Value: 'EXACT' },
      QuantityContained: [{ MeasurementUnitCode: 'MLT', Value: 2 }],
    }];

    const mapped = mapProductImport(imported);

    expect(mapped.formValues).not.toHaveProperty('ean');
    expect(mapped.formValues).not.toHaveProperty('fat');
    expect(mapped.formValues).not.toHaveProperty('countryOfOrigin');
    expect(mapped.formValues.name).toBe('Hedelmakarkki');
  });

  it('accepts alternate supported calorie and gram unit codes without calculating values', () => {
    const imported = makeImport();
    imported.TradeItem.NutritionalInformationModule.NutrientHeader[0].NutrientDetail = [
      {
        NutrientTypeCode: { Value: 'ENER-' },
        MeasurementPrecisionCode: { Value: 'EXACT' },
        QuantityContained: [{ MeasurementUnitCode: 'E14', Value: 351 }],
      },
      {
        NutrientTypeCode: { Value: 'PRO-' },
        MeasurementPrecisionCode: { Value: 'EXACT' },
        QuantityContained: [{ MeasurementUnitCode: 'G', Value: 0.19 }],
      },
    ];

    expect(mapProductImport(imported).formValues).toMatchObject({
      energyCalory: '351',
      protein: '0.19',
    });
    expect(mapProductImport(imported).formValues).not.toHaveProperty('energyJoule');
  });

  it('merges imported images first without duplicates or removing existing images', () => {
    expect(mergeImportedImageUrls(
      ['https://example.com/saved.jpg', 'https://example.com/main.jpg'],
      ['https://example.com/main.jpg', 'https://example.com/new.jpg']
    )).toEqual([
      'https://example.com/main.jpg',
      'https://example.com/new.jpg',
      'https://example.com/saved.jpg',
    ]);
  });

  it('rejects invalid product JSON before form state can be populated', () => {
    expect(() => parseProductImportJson('{invalid')).toThrow();
    expect(() => parseProductImportJson(JSON.stringify({ other: {} }))).toThrow('Invalid product import JSON');
  });
});
