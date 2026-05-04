import { Timestamp } from 'firebase/firestore';
import { SubItem } from './sub-item';

export interface Fullfilment {
  id?: string;
  client: SubItem;
  date: string;
  company: string;
  amount?: number;
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
