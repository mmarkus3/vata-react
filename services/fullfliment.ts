import { Fullfilment } from '@/types/fullfilment';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, where } from 'firebase/firestore';
import { getItems } from './firestore';

const converter = {
  toFirestore: (item: Fullfilment) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined) => {
    const fullfilment = snapshot.data(options) as Fullfilment;
    const products = fullfilment.products ? [...fullfilment.products] : [];
    const amount = fullfilment.products?.reduce((prev, curr) => prev + curr.amount, 0);
    return {
      ...fullfilment,
      products,
      amount,
      created: new Date(fullfilment.date),
    };
  },
};

export async function getClientFullfilments(clientId: string, companyId: string): Promise<Fullfilment[]> {
  try {
    return await getItems<Fullfilment>('fullfilments', [where('client.guid', '==', clientId), where('company', '==', companyId)], converter);
  } catch (error) {
    console.error('Failed to fetch client fullfilments:', error);
    throw new Error(error instanceof Error ? error.message : 'Täyttöjen haku epäonnistui');
  }
}

export async function getCompanyFullfilments(companyId: string, startDate: Date, endDate: Date): Promise<Fullfilment[]> {
  try {
    return await getItems<Fullfilment>('fullfilments', [where('company', '==', companyId)], converter).then((res) => res.filter((it) => it.created! >= startDate && it.created! <= endDate));
  } catch (error) {
    console.error('Failed to fetch company fullfilments:', error);
    throw new Error(error instanceof Error ? error.message : 'Täyttöjen haku epäonnistui');
  }
}