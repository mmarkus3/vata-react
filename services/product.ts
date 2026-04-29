import type { Product } from '@/types/product';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, where } from 'firebase/firestore';
import { getSnapshotItems } from './firestore';

const converter = {
  toFirestore: (item: Product) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined) => {
    const product = snapshot.data(options) as Product;
    const price = product.price ? +product.price : 0;
    return {
      ...product,
      price,
    };
  },
};

export function getProductsByCompany(companyId: string, cb: (results: Product[]) => void) {
  try {
    getSnapshotItems<Product>('products', cb, [where('company', '==', companyId)], converter);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}
