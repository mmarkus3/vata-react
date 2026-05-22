export interface Order {
  id?: string;
  company: string;
  created: Date;
  status: 'draft' | 'pending' | 'placed' | 'paid' | 'sent';
  products: OrderProduct[];
  updated?: Date;
  customer?: OrderCustomer;
  deliveryMethod?: string;
  paymentMethod?: string;
  discount?: string;
  returnUrl?: string;
  amount?: number;
  country: string;
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
