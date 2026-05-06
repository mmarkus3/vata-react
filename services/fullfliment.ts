import { createDocumentRef, getDocumentRef, getItems, runInTransaction, updateItem, whereEqual } from '@/services/firestore';
import { Fullfilment } from '@/types/fullfilment';

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

function aggregateProducts(products: Fullfilment['products']) {
  const map = new Map<string, { name: string; amount: number }>();
  for (const item of products) {
    const key = item.product.guid;
    const prev = map.get(key);
    map.set(key, {
      name: item.product.name,
      amount: (prev?.amount ?? 0) + item.amount,
    });
  }
  return map;
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
  original: Omit<Fullfilment, 'amount' | 'created'>,
  updated: Omit<Fullfilment, 'id' | 'amount' | 'created'>
) {
  try {
    return await runInTransaction(async (transaction) => {
      const oldMap = aggregateProducts(original.products);
      const newMap = aggregateProducts(updated.products);
      const allProductIds = new Set<string>([...oldMap.keys(), ...newMap.keys()]);

      const productSnapshots = await Promise.all(
        [...allProductIds].map(async (productId) => {
          const ref = getDocumentRef('products', productId);
          const snap = await transaction.get(ref);
          return { productId, ref, snap };
        })
      );

      for (const { productId, snap } of productSnapshots) {
        if (!snap.exists()) {
          const name = newMap.get(productId)?.name ?? oldMap.get(productId)?.name ?? productId;
          throw new Error(`Tuotetta ei löytynyt: ${name}`);
        }
      }

      for (const { productId, ref, snap } of productSnapshots) {
        const oldAmount = oldMap.get(productId)?.amount ?? 0;
        const newAmount = newMap.get(productId)?.amount ?? 0;
        const delta = newAmount - oldAmount;
        if (delta === 0) continue;

        const current = Number(snap.data().amount ?? 0);
        transaction.update(ref, { amount: current - delta });
      }

      const fullfilmentRef = getDocumentRef('fullfilments', fullfilmentId);
      transaction.update(fullfilmentRef, updated);
      return fullfilmentId;
    });
  } catch (error) {
    console.error('Failed to update fullfilment:', error);
    throw new Error(error instanceof Error ? error.message : 'Täytön päivitys epäonnistui');
  }
}
