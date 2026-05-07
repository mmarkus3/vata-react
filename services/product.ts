import type { Product } from '@/types/product';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, where } from 'firebase/firestore';
import { deleteItem, getItem, getSnapshotItems, saveItem, updateItem } from './firestore';
import { deleteBarcodeImage, uploadBarcodeImage } from './storage';

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
    // First, save the product without image to get the ID
    const productId = await saveItem('products', product);

    if (barcodeImageUri) {
      const timestamp = Date.now();
      const fileName = `barcode-${timestamp}.jpg`;
      const barcodeImageUrl = await uploadBarcodeImage(product.company, productId, barcodeImageUri, fileName);

      await updateItem('products', productId, {
        barcode: barcodeImageUrl,
      });
    }

    return productId;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

export async function getProductById(productId: string) {
  try {
    return await getItem<Product>('products', productId, converter);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
}

export async function updateProduct(
  productId: string,
  data: Partial<Omit<Product, 'id' | 'company'>>,
  companyId?: string,
  oldBarcodeImageUrl?: string,
  newBarcodeImageUri?: string,
  onUploadProgress?: (progress: number) => void
) {
  try {
    if (newBarcodeImageUri) {
      if (!companyId) {
        throw new Error('Company ID is required to upload a new barcode image.');
      }

      const timestamp = Date.now();
      const fileName = `barcode-${timestamp}.jpg`;
      const barcodeImageUrl = await uploadBarcodeImage(
        companyId,
        productId,
        newBarcodeImageUri,
        fileName,
        onUploadProgress
      );

      data = {
        ...data,
        barcode: barcodeImageUrl,
      };

      if (oldBarcodeImageUrl) {
        await deleteBarcodeImage(oldBarcodeImageUrl);
      }
    } else if (!data.barcode && oldBarcodeImageUrl) {
      await deleteBarcodeImage(oldBarcodeImageUrl);
    }

    await updateItem('products', productId, data);
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    await deleteItem('products', productId);
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}
