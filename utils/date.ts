import { Timestamp } from 'firebase/firestore';

export const isTimestamp = (object: any): object is Timestamp => {
  if (object == null || typeof object === 'string') {
    return false;
  }
  return 'toDate' in object;
};