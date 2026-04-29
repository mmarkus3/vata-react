import type { Product } from '@/types/product';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, where } from 'firebase/firestore';
import { getSnapshotItems, saveItem, updateItem } from './firestore';
import { uploadBarcodeImage } from './storage';

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
    return getSnapshotItems<Product>('products', cb, [where('company', '==', companyId)], converter);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

export async function createProduct(product: Omit<Product, 'id'>, barcodeImageUri?: string) {
  try {
    let barcode: string | undefined;

    // First, save the product without image to get the ID
    const productId = await saveItem('products', product);

    if (barcodeImageUri) {
      // Generate a unique filename
      const timestamp = Date.now();
      const fileName = `barcode-${timestamp}.jpg`;
      barcode = await uploadBarcodeImage(product.company, productId, barcodeImageUri, fileName);

      // Update the product with the image URL
      await updateItem('products', productId, {
        barcode,
      });
    }

    return productId;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}
