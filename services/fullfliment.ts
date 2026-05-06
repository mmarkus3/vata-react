import { Fullfilment } from '@/types/fullfilment';
import { createDocumentRef, getDocumentRef, getItems, runInTransaction, whereEqual } from '@/services/firestore';

const converter = {
  toFirestore: (item: Fullfilment) => item,
  fromFirestore: (snapshot: any, options?: any) => {
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

class InsufficientStockError extends Error {
  constructor(productName: string, available: number, requested: number) {
    super(`Varastosaldo ei riitä tuotteelle "${productName}". Saatavilla ${available}, pyydetty ${requested}.`);
    this.name = 'InsufficientStockError';
  }
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
    return await runInTransaction(async (transaction) => {
      const productSnapshots = await Promise.all(
        fullfilment.products.map(async (item) => {
          const productRef = getDocumentRef('products', item.product.guid);
          const productSnap = await transaction.get(productRef);
          return { item, productRef, productSnap };
        })
      );

      for (const { item, productSnap } of productSnapshots) {
        if (!productSnap.exists()) {
          throw new Error(`Tuotetta ei löytynyt: ${item.product.name}`);
        }

        const availableAmount = Number(productSnap.data().amount ?? 0);
        if (!Number.isFinite(availableAmount) || availableAmount < item.amount) {
          throw new InsufficientStockError(item.product.name, availableAmount, item.amount);
        }
      }

      for (const { item, productRef, productSnap } of productSnapshots) {
        const currentAmount = Number(productSnap.data().amount ?? 0);
        transaction.update(productRef, {
          amount: currentAmount - item.amount,
        });
      }

      const fullfilmentRef = createDocumentRef('fullfilments');
      transaction.set(fullfilmentRef, fullfilment);

      return fullfilmentRef.id;
    });
  } catch (error) {
    console.error('Failed to create fullfilment:', error);

    if (error instanceof InsufficientStockError) {
      throw error;
    }

    throw new Error(error instanceof Error ? error.message : 'Täytön luonti epäonnistui');
  }
}
