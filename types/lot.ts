import { Timestamp } from 'firebase/firestore';

export interface Lot {
  id?: string;
  name: string;
  expires: Date | Timestamp;
  company: string;
  product: string;
  amount: number;
  remaining: number;
  // extra
  expiresDate?: Date;
}
