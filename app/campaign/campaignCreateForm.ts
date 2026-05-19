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
  };
}

export function validateCampaignCreateForm(values: CampaignCreateFormValues): string | null {
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
  if (discountValue == null) return 'campaigns.create.errors.discountInvalid';
  if (values.discountType === 'percentage' && discountValue > 100) {
    return 'campaigns.create.errors.discountPercentageRange';
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
  const discountValue = parseDiscountValue(input.values.discountValue);

  if (!start || !end || discountValue == null) {
    throw new Error('Invalid campaign form values');
  }

  const targetingMode = input.values.targetingMode;

  const selectedProducts = targetingMode === 'selected'
    ? input.products.filter((product) => product.id && input.values.selectedProductIds.includes(product.id))
    : targetingMode === 'all_products'
      ? input.products
      : input.products.filter((product) => product.category === input.values.categoryId);

  const products = selectedProducts
    .filter((product): product is Product & { id: string } => Boolean(product.id))
    .map((product) => ({
      id: product.id,
      name: product.name,
      discountPercentage: input.values.discountType === 'percentage' ? discountValue : undefined,
      discountFixed: input.values.discountType === 'fixed' ? discountValue : undefined,
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
