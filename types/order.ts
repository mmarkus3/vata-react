
export interface OrderProduct {
  id: string;
  name: string;
  amount: number;
}

export interface Order {
  id?: string;
  company: string;
  status: 'draft' | 'pending' | 'placed' | 'sent';
  products: OrderProduct[];
  created: Date;
  updated?: Date;
}
