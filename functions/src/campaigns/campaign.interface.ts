import { Timestamp } from 'firebase/firestore';

export type CampaignDiscountType = 'percentage' | 'fixed';
export type CampaignTargetingMode = 'selected' | 'all_products' | 'category';
export type CampaignMode = 'code' | 'auto';

export interface Campaign {
  id: string;
  created: Timestamp;
  company: string;
  name: string;
  code?: string;
  mode?: CampaignMode;
  targetingMode?: CampaignTargetingMode;
  categoryId?: string;
  selectedProductIds?: string[];
  products: { id: string; name: string; discountFixed?: number; discountPercentage?: number }[];
  discountType: CampaignDiscountType;
  discountValue?: number;
  start: Timestamp;
  end: Timestamp;
}