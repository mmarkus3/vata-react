import { Timestamp } from 'firebase-admin/firestore';

export interface Order {
  id?: string;
  company: string;
  created: Timestamp;
  status: 'draft' | 'pending' | 'placed' | 'paid' | 'sent';
  products: OrderProduct[];
  updated?: Timestamp;
  customer?: OrderCustomer;
  deliveryMethod?: string;
  paymentMethod?: string;
  discount?: string;
  returnUrl?: string;
  country: string;
  amount?: number;
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
  phone: string;
  address_street: string;
  address_city: string;
  address_zip: string;
}
