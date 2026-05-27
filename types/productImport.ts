export interface ProductImport {
  TradeItem: ProductImportTradeItem;
}

export interface ProductImportTradeItem {
  IsBrandBankPublication: boolean;
  TargetSector: string[];
  AllergenInformationModule: AllergenInformationModule;
  DeliveryPurchasingInformationModule: DeliveryPurchasingInformationModule;
  DutyFeeTaxInformationModule: DutyFeeTaxInformationModule;
  FoodAndBeverageIngredientModule: FoodAndBeverageIngredientModule;
  MarketingInformationModule: MarketingInformationModule;
  NutritionalInformationModule: NutritionalInformationModule;
  PackagingInformationModule: PackagingInformationModule;
  PackagingMarkingModule: PackagingMarkingModule;
  PlaceOfItemActivityModule: PlaceOfItemActivityModule;
  ReferencedFileDetailInformationModule: ReferencedFileDetailInformationModule;
  SalesInformationModule: SalesInformationModule;
  TradeItemDataCarrierAndIdentificationModule: TradeItemDataCarrierAndIdentificationModule;
  TradeItemDescriptionModule: TradeItemDescriptionModule;
  TradeItemLifespanModule: TradeItemLifespanModule;
  TradeItemMeasurementsModule: TradeItemMeasurementsModule;
  VariableTradeItemInformationModule: VariableTradeItemInformationModule;
  IsTradeItemABaseUnit: boolean;
  IsTradeItemAConsumerUnit: boolean;
  IsTradeItemADespatchUnit: boolean;
  IsTradeItemAnOrderableUnit: boolean;
  TradeItemUnitDescriptorCode: ProductImportCode;
  TradeItemTradeChannelCode: ProductImportCode[];
  InformationProviderOfTradeItem: ProductImportParty;
  ManufacturerOfTradeItem: ProductImportParty[];
  GdsnTradeItemClassification: GdsnTradeItemClassification;
  TargetMarket: ProductImportTargetMarket;
  TradeItemContactInformation: ProductImportContact[];
  TradeItemSynchronisationDates: ProductImportSynchronisationDates;
  Gtin: string;
}

export interface ProductImportCode {
  Value: string;
}

export interface ProductImportLocalizedValue {
  LanguageCode: string;
  Value: string;
}

export interface ProductImportMeasurement {
  MeasurementUnitCode: string;
  Value: number;
}

export interface ProductImportParty {
  Gln: string;
  PartyName: string;
}

export interface AllergenInformationModule {
  AllergenRelatedInformation: AllergenRelatedInformation[];
}

export interface AllergenRelatedInformation {
  Allergen: ProductImportAllergen[];
}

export interface ProductImportAllergen {
  AllergenTypeCode: ProductImportCode;
  LevelOfContainmentCode: ProductImportCode;
}

export interface DeliveryPurchasingInformationModule {
  DeliveryPurchasingInformation: {
    StartAvailabilityDateTime: string;
  };
}

export interface DutyFeeTaxInformationModule {
  DutyFeeTaxInformation: DutyFeeTaxInformation[];
}

export interface DutyFeeTaxInformation {
  DutyFeeTaxAgencyCode: ProductImportCode;
  DutyFeeTaxTypeCode: string;
  DutyFeeTax: Array<{
    DutyFeeTaxCategoryCode: ProductImportCode;
  }>;
}

export interface FoodAndBeverageIngredientModule {
  IngredientStatement: ProductImportLocalizedValue[];
}

export interface MarketingInformationModule {
  MarketingInformation: {
    TradeItemMarketingMessage: ProductImportLocalizedValue[];
  };
}

export interface NutritionalInformationModule {
  NutrientHeader: ProductImportNutrientHeader[];
}

export interface ProductImportNutrientHeader {
  PreparationStateCode: ProductImportCode;
  NutrientBasisQuantity: ProductImportMeasurement;
  NutrientDetail: ProductImportNutrientDetail[];
}

export interface ProductImportNutrientDetail {
  NutrientTypeCode: ProductImportCode;
  MeasurementPrecisionCode: ProductImportCode;
  QuantityContained: ProductImportMeasurement[];
}

export interface PackagingInformationModule {
  Packaging: ProductImportPackaging[];
}

export interface ProductImportPackaging {
  PackagingTypeCode: ProductImportCode;
  PackagingMaterial: ProductImportPackagingMaterial[];
}

export interface ProductImportPackagingMaterial {
  PackagingMaterialTypeCode: ProductImportCode;
  PackagingMaterialCompositionQuantity: ProductImportMeasurement[];
}

export interface PackagingMarkingModule {
  PackagingMarking: {
    HasBatchNumber: boolean;
    PackagingDate: Array<{
      TradeItemDateOnPackagingTypeCode: ProductImportCode;
    }>;
  };
}

export interface PlaceOfItemActivityModule {
  ImportClassification: ProductImportClassification[];
  PlaceOfProductActivity: {
    CountryOfOrigin: Array<{
      CountryCode: ProductImportCode;
    }>;
  };
}

export interface ProductImportClassification {
  ImportClassificationTypeCode: ProductImportCode;
  ImportClassificationValue: string;
}

export interface ReferencedFileDetailInformationModule {
  ReferencedFileHeader: ProductImportReferencedFile[];
}

export interface ProductImportReferencedFile {
  QualificationDateTime: string;
  MediaQualificationStatus: string;
  MediaSourceGln: string;
  ReferencedFileDetail: ProductImportFileDetail;
  MimeType: string;
  ReferencedFileTypeCode: ProductImportCode;
  FileFormatName: string;
  FileName: string;
  UniformResourceIdentifier: string;
  IsPrimaryFile: string;
}

export interface ProductImportFileDetail {
  FileColourSchemeCode: ProductImportCode;
  FilePixelHeight: number;
  FilePixelWidth: number;
  FileResolutionDescription: ProductImportLocalizedValue[];
  FileSize: ProductImportMeasurement[];
}

export interface SalesInformationModule {
  SalesInformation: {
    PriceComparisonMeasurement: ProductImportMeasurement[];
  };
}

export interface TradeItemDataCarrierAndIdentificationModule {
  DataCarrier: Array<{
    DataCarrierTypeCode: ProductImportCode;
  }>;
}

export interface TradeItemDescriptionModule {
  TradeItemDescriptionInformation: ProductImportDescriptionInformation;
}

export interface ProductImportDescriptionInformation {
  DescriptionShort: ProductImportLocalizedValue[];
  FunctionalName: ProductImportLocalizedValue[];
  RegulatedProductName: ProductImportLocalizedValue[];
  TradeItemDescription: ProductImportLocalizedValue[];
  BrandNameInformation: {
    BrandName: string;
  };
}

export interface TradeItemLifespanModule {
  TradeItemLifespan: {
    MinimumTradeItemLifespanFromTimeOfProduction: number;
  };
}

export interface TradeItemMeasurementsModule {
  TradeItemMeasurements: ProductImportTradeItemMeasurements;
}

export interface ProductImportTradeItemMeasurements {
  Depth: ProductImportMeasurement;
  Height: ProductImportMeasurement;
  NetContent: ProductImportMeasurement[];
  Width: ProductImportMeasurement;
  TradeItemWeight: {
    GrossWeight: ProductImportMeasurement;
    NetWeight: ProductImportMeasurement;
  };
}

export interface VariableTradeItemInformationModule {
  VariableTradeItemInformation: {
    IsTradeItemAVariableUnit: boolean;
  };
}

export interface GdsnTradeItemClassification {
  GpcSegmentCode: string;
  GpcClassCode: string;
  GpcFamilyCode: string;
  GpcCategoryCode: string;
  GpcCategoryName: string;
  GDSNTradeItemClassificationAttribute: ProductImportClassificationAttribute[];
  AdditionalTradeItemClassification: ProductImportAdditionalClassification[];
}

export interface ProductImportClassificationAttribute {
  GpcAttributeTypeCode: string;
  GpcAttributeValueCode: string;
  GpcAttributeTypeDefinition: string;
}

export interface ProductImportAdditionalClassification {
  AdditionalTradeItemClassificationSystemCode: ProductImportCode;
  AdditionalTradeItemClassificationValue: Array<{
    AdditionalTradeItemClassificationCodeValue: string;
  }>;
}

export interface ProductImportTargetMarket {
  TargetMarketCountryCode: ProductImportCode;
}

export interface ProductImportContact {
  ContactTypeCode: ProductImportCode;
  ContactAddress: string;
  ContactName: string;
}

export interface ProductImportSynchronisationDates {
  LastChangeDateTime: string;
  EffectiveDateTime: string;
  PublicationDateTime: string;
}
