import { Timestamp } from 'firebase/firestore';

export interface Fullfilment {
  id?: string;
  client: { guid: string; name: string; };
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

export interface FullfilmentItem {
  guid: string;
  name: string;
  price: number;
  ean: string;
}