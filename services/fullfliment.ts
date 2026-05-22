import { createDocumentRef, getItems, saveAsItem, saveItem, updateItem, whereEqual } from '@/services/firestore';
import { Fullfilment, FullfilmentProduct } from '@/types/fullfilment';
import { SubItem } from '@/types/sub-item';

interface Lot {
  name: string;
  company: string;
  product: string;
  amount: number;
  remaining: number;
}

const converter = {
  toFirestore: (item: Fullfilment) => item,
  fromFirestore: (snapshot: any, options?: any) => {
    const fullfilment = snapshot.data(options) as Fullfilment & { lots?: Lot[]; product: SubItem };
    let products = fullfilment.products ? [...fullfilment.products] : [];
    if (fullfilment.lots && fullfilment.product) {
      const lotProducts = fullfilment.lots.map((it) => lotProductToFullfilmentProduct(it, fullfilment.product, fullfilment.amount ?? it.amount))
      products = [...products, ...lotProducts];
    }
    const amount = products.reduce((prev, curr) => prev + curr.amount, 0);
    return {
      ...fullfilment,
      products,
      amount,
      created: new Date(fullfilment.date),
    };
  },
};

function lotProductToFullfilmentProduct(lot: Lot, product: SubItem, amount: number) {
  return {
    amount,
    product: { guid: lot.product, name: product.name, price: 0, ean: '' },
  } as FullfilmentProduct;
}

export async function getClientFullfilments(clientId: string, companyId: string): Promise<Fullfilment[]> {
  try {
    return await getItems<Fullfilment>('fullfilments', [whereEqual('client.guid', clientId), whereEqual('company', companyId)], converter);
  } catch (error) {
    console.error('Failed to fetch client fullfilments:', error);
    throw new Error(error instanceof Error ? error.message : 'Täyttöjen haku epäonnistui');
  }
}

export async function getCompanyFullfilments(companyId: string, startDate: Date, endDate: Date): Promise<Fullfilment[]> {
  try {
    return await getItems<Fullfilment>('fullfilments', [whereEqual('company', companyId)], converter).then((res) =>
      res.filter((it) => it.created! >= startDate && it.created! <= endDate)
    );
  } catch (error) {
    console.error('Failed to fetch company fullfilments:', error);
    throw new Error(error instanceof Error ? error.message : 'Täyttöjen haku epäonnistui');
  }
}

export async function createFullfilment(fullfilment: Omit<Fullfilment, 'id' | 'amount' | 'created'>) {
  try {
    return await saveItem('fullfilments', fullfilment);
  } catch (error) {
    console.error('Failed to create fullfilment:', error);

    throw new Error(error instanceof Error ? error.message : 'Täytön luonti epäonnistui');
  }
}

export async function updateFullfilment(fullfilmentId: string, updated: Partial<Fullfilment>) {
  try {
    return await updateItem('fullfilments', fullfilmentId, updated);
  } catch (error) {
    console.error('Failed to update fullfilment:', error);
    throw error;
  }
}

export async function updateFullfilmentWithProducts(
  fullfilmentId: string,
  _original: Omit<Fullfilment, 'amount' | 'created'>,
  updated: Omit<Fullfilment, 'id' | 'amount' | 'created'>
) {
  try {
    await saveAsItem('fullfilments', fullfilmentId, updated);
    return fullfilmentId;
  } catch (error) {
    console.error('Failed to update fullfilment:', error);
    throw new Error(error instanceof Error ? error.message : 'Täytön päivitys epäonnistui');
  }
}
