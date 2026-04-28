import { Timestamp } from 'firebase/firestore';
import { Lot } from './lot';
import { SubItem } from './sub-item';

export interface Fullfilment {
  id?: string;
  product: SubItem & { price: number };
  client: SubItem;
  date: string;
  company: string;
  amount?: number;
  lots?: Lot[];
  products: FullfilmentProduct[];
  created?: Date;
  deleted?: boolean;
  mail?: { guid: string; sent: Timestamp };
}

export interface FullfilmentProduct {
  amount: number;
  product: FullfilmentItem;
}

export interface FullfilmentItem extends SubItem {
  price: number;
  ean: string;
}
