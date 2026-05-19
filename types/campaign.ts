import { Timestamp } from 'firebase/firestore';

export interface Campaign {
  id?: string;
  company: string;
  name: string;
  code?: string;
  products: { id: string; name: string; discountPrice?: number; discountPercentage?: number }[];
  discountType: 'percentage' | 'price';
  start: Timestamp;
  end: Timestamp;
}