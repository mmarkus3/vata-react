import type { Client } from '@/types/client';
import { where } from 'firebase/firestore';
import { getSnapshotItems, saveItem } from './firestore';

export function getClientsByCompany(companyId: string, cb: (results: Client[]) => void) {
  try {
    return getSnapshotItems<Client>('clients', cb, [where('company', '==', companyId)]);
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    throw error;
  }
}

export async function createClient(client: Omit<Client, 'id'>) {
  try {
    return await saveItem('clients', client);
  } catch (error) {
    console.error('Failed to create client:', error);
    throw new Error(error instanceof Error ? error.message : 'Asiakkaan luonti epäonnistui');
  }
}