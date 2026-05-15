import { Timestamp } from 'firebase-admin/firestore';

export interface Order {
  id?: string;
  company: string;
  created: Timestamp;
  status: 'draft' | 'pending' | 'placed' | 'sent';
  products: OrderProduct[];
  updated?: Timestamp;
  customer?: OrderCustomer;
  deliveryMethod?: string;
  discount?: string;
  returnUrl?: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  amount: number;
}

export interface OrderCustomer {
  firstname: string;
  lastname: string;
  email: string;
  address_street: string;
  address_city: string;
  address_zip: string;
}