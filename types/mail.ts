import { Timestamp } from 'firebase/firestore';

export interface Mail {
  id?: string;
  email: string;
  fullfilment?: string;
  order?: string;
  created: Timestamp;
  from?: { email: string; name: string };
  replyTo?: string;
}
