import type { Client } from '@/types/client';
import { where } from 'firebase/firestore';
import { getSnapshotItems } from './firestore';

export function getClientsByCompany(companyId: string, cb: (results: Client[]) => void) {
  try {
    return getSnapshotItems<Client>('clients', cb, [where('company', '==', companyId)]);
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    throw error;
  }
}