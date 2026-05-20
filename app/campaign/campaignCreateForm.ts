import type { Campaign } from '@/types/campaign';
import type { Product } from '@/types/product';

export type CampaignTargetingMode = 'selected' | 'all_products' | 'category';
export type CampaignMode = 'code' | 'auto';

export interface CampaignCreateFormValues {
  name: string;
  code: string;
  start: string;
  end: string;
  targetingMode: CampaignTargetingMode;
  selectedProductIds: string[];
  categoryId: string;
  discountType: Campaign['discountType'];
  discountValue: string;
  discountFixedValues: Record<string, string>;
  discountFixedBulkValue: string;
}

export interface CampaignCreatePayload extends Omit<Campaign, 'id' | 'created'> {
  mode: CampaignMode;
  targetingMode: CampaignTargetingMode;
  categoryId?: string;
  selectedProductIds?: string[];
  discountValue: number;
}

export const defaultCampaignCreateFormValues: CampaignCreateFormValues = {
  name: '',
  code: '',
  start: '',
  end: '',
  targetingMode: 'selected',
  selectedProductIds: [],
  categoryId: '',
  discountType: 'percentage',
  discountValue: '',
  discountFixedValues: {},
  discountFixedBulkValue: '',
};

const parseDateInput = (value: string): Date | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const parseDiscountValue = (value: string): number | null => {
  const parsed = Number(value.trim().replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

export const buildCampaignMode = (code: string): CampaignMode => (code.trim().length > 0 ? 'code' : 'auto');

export function mapCampaignToFormValues(campaign: Campaign): CampaignCreateFormValues {
  const selectedIds = campaign.selectedProductIds?.length
    ? campaign.selectedProductIds
    : (campaign.products ?? []).map((product) => product.id).filter(Boolean);

  const discountValue =
    typeof campaign.discountValue === 'number'
      ? campaign.discountValue
      : campaign.discountType === 'percentage'
        ? campaign.products?.[0]?.discountPercentage
        : campaign.products?.[0]?.discountFixed;

  const discountFixedValues = (campaign.products ?? []).reduce<Record<string, string>>((acc, product) => {
    if (product.id && typeof product.discountFixed === 'number') {
      acc[product.id] = String(product.discountFixed);
    }
    return acc;
  }, {});

  return {
    name: campaign.name ?? '',
    code: campaign.code ?? '',
    start: campaign.start instanceof Date ? campaign.start.toISOString() : new Date(campaign.start as unknown as string).toISOString(),
    end: campaign.end instanceof Date ? campaign.end.toISOString() : new Date(campaign.end as unknown as string).toISOString(),
    targetingMode: campaign.targetingMode ?? 'selected',
    selectedProductIds: selectedIds,
    categoryId: campaign.categoryId ?? '',
    discountType: campaign.discountType,
    discountValue: discountValue != null ? String(discountValue) : '',
    discountFixedValues,
    discountFixedBulkValue: '',
  };
}

export function getCampaignTargetProducts(values: CampaignCreateFormValues, products: Product[]): (Product & { id: string })[] {
  const selectedProducts = values.targetingMode === 'selected'
    ? products.filter((product) => product.id && values.selectedProductIds.includes(product.id))
    : values.targetingMode === 'all_products'
      ? products
      : products.filter((product) => product.category === values.categoryId);

  return selectedProducts.filter((product): product is Product & { id: string } => Boolean(product.id));
}

export function syncDiscountFixedValues(
  values: CampaignCreateFormValues,
  products: Product[],
): CampaignCreateFormValues {
  const targetIds = new Set(getCampaignTargetProducts(values, products).map((product) => product.id));
  const nextFixedValues: Record<string, string> = {};

  for (const [productId, value] of Object.entries(values.discountFixedValues)) {
    if (targetIds.has(productId)) {
      nextFixedValues[productId] = value;
    }
  }

  return { ...values, discountFixedValues: nextFixedValues };
}

export function applyBulkDiscountFixedValue(
  values: CampaignCreateFormValues,
  products: Product[],
): CampaignCreateFormValues | null {
  const parsedBulkValue = parseDiscountValue(values.discountFixedBulkValue);
  if (parsedBulkValue == null) return null;

  const targetProducts = getCampaignTargetProducts(values, products);
  const bulkValue = String(parsedBulkValue);
  const nextFixedValues = { ...values.discountFixedValues };

  for (const product of targetProducts) {
    nextFixedValues[product.id] = bulkValue;
  }

  return { ...values, discountFixedValues: nextFixedValues };
}

export function validateCampaignCreateForm(values: CampaignCreateFormValues, products: Product[] = []): string | null {
  if (!values.name.trim()) return 'campaigns.create.errors.nameRequired';

  const start = parseDateInput(values.start);
  const end = parseDateInput(values.end);

  if (!start || !end) return 'campaigns.create.errors.datesRequired';
  if (end.getTime() <= start.getTime()) return 'campaigns.create.errors.invalidDateRange';

  if (values.targetingMode === 'selected' && values.selectedProductIds.length === 0) {
    return 'campaigns.create.errors.productsRequired';
  }

  if (values.targetingMode === 'category' && !values.categoryId) {
    return 'campaigns.create.errors.categoryRequired';
  }

  const discountValue = parseDiscountValue(values.discountValue);
  if (values.discountType === 'percentage') {
    if (discountValue == null) return 'campaigns.create.errors.discountInvalid';
    if (discountValue > 100) return 'campaigns.create.errors.discountPercentageRange';
  }
  if (values.discountType === 'fixed' && products.length > 0) {
    const targetProducts = getCampaignTargetProducts(values, products);
    const hasInvalidFixed = targetProducts.some((product) => {
      const value = values.discountFixedValues[product.id];
      return parseDiscountValue(value ?? '') == null;
    });
    if (hasInvalidFixed) return 'campaigns.create.errors.discountInvalid';
  }

  return null;
}

export function buildCampaignCreatePayload(input: {
  values: CampaignCreateFormValues;
  company: string;
  products: Product[];
}): CampaignCreatePayload {
  const start = parseDateInput(input.values.start);
  const end = parseDateInput(input.values.end);
  const percentageDiscountValue = parseDiscountValue(input.values.discountValue);

  if (!start || !end) {
    throw new Error('Invalid campaign form values');
  }

  const targetingMode = input.values.targetingMode;

  const selectedProducts = getCampaignTargetProducts(input.values, input.products);
  const fixedDiscountValues = selectedProducts.map((product) =>
    parseDiscountValue(input.values.discountFixedValues[product.id] ?? ''),
  );
  const fallbackFixedDiscount = fixedDiscountValues.find((value): value is number => value != null) ?? null;
  const discountValue = input.values.discountType === 'percentage' ? percentageDiscountValue : fallbackFixedDiscount;

  if (discountValue == null) {
    throw new Error('Invalid campaign form values');
  }

  const products = selectedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      discountPercentage: input.values.discountType === 'percentage' ? discountValue : undefined,
      discountFixed:
        input.values.discountType === 'fixed'
          ? parseDiscountValue(input.values.discountFixedValues[product.id] ?? '') ?? undefined
          : undefined,
    }));

  return {
    company: input.company,
    name: input.values.name.trim(),
    code: input.values.code.trim() || undefined,
    mode: buildCampaignMode(input.values.code),
    products,
    discountType: input.values.discountType,
    discountValue,
    targetingMode,
    selectedProductIds: targetingMode === 'selected' ? input.values.selectedProductIds : undefined,
    categoryId: targetingMode === 'category' ? input.values.categoryId : undefined,
    start,
    end,
  };
}
