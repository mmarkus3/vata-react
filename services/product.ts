import type { Product } from '@/types/product';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, where } from 'firebase/firestore';
import { deleteItem, getItem, getSnapshotItems, saveItem, updateItem } from './firestore';
import { deleteBarcodeImage, uploadBarcodeImage, uploadProductImage } from './storage';

const converter = {
  toFirestore: (item: Product) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined) => {
    const product = snapshot.data(options) as Product;
    const normalizeOptionalNumber = (value: unknown) => {
      if (value === undefined || value === null || value === '') return undefined;
      const parsed = +value;
      return Number.isNaN(parsed) ? undefined : parsed;
    };
    const price = product.price ? +product.price : 0;
    return {
      ...product,
      price,
      retailPrice: normalizeOptionalNumber(product.retailPrice),
      unitPrice: normalizeOptionalNumber(product.unitPrice),
      energyJoule: normalizeOptionalNumber(product.energyJoule),
      energyCalory: normalizeOptionalNumber(product.energyCalory),
      fat: normalizeOptionalNumber(product.fat),
      saturatedFat: normalizeOptionalNumber(product.saturatedFat),
      carbohydrate: normalizeOptionalNumber(product.carbohydrate),
      saturatedCarbohydrate: normalizeOptionalNumber(product.saturatedCarbohydrate),
      protein: normalizeOptionalNumber(product.protein),
      salt: normalizeOptionalNumber(product.salt),
      fiber: normalizeOptionalNumber(product.fiber),
      images: Array.isArray(product.images) ? product.images : [],
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

export function getProductsByCompanyAndCategory(companyId: string, category: string, cb: (results: Product[]) => void) {
  try {
    return getSnapshotItems<Product>('products', cb, [where('company', '==', companyId), where('category', '==', category)], converter);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

export function getProductsByCompanyAndCategoryReference(
  companyId: string,
  categoryId: string,
  legacyCategoryName: string | undefined,
  cb: (results: Product[]) => void
) {
  try {
    return getProductsByCompany(companyId, (results) => {
      const normalizedId = categoryId.trim();
      const normalizedLegacyName = legacyCategoryName?.trim() ?? '';
      cb(
        results.filter((product) => {
          const reference = product.category?.trim() ?? '';
          return reference === normalizedId || (normalizedLegacyName && reference === normalizedLegacyName);
        })
      );
    });
  } catch (error) {
    console.error('Failed to fetch products by category reference:', error);
    throw error;
  }
}

interface CreateProductOptions {
  barcodeImageUri?: string;
  productImageUris?: string[];
  imageLinks?: string[];
}

export async function createProduct(product: Omit<Product, 'id'>, options: CreateProductOptions = {}) {
  try {
    const productToSave = {
      ...product,
      images: options.imageLinks ?? [],
    };

    const productId = await saveItem('products', productToSave);

    if (options.barcodeImageUri) {
      const timestamp = Date.now();
      const fileName = `barcode-${timestamp}.jpg`;
      const barcodeImageUrl = await uploadBarcodeImage(product.company, productId, options.barcodeImageUri, fileName);

      await updateItem('products', productId, {
        barcode: barcodeImageUrl,
      });
    }

    if (options.productImageUris && options.productImageUris.length > 0) {
      const uploadedUrls = [] as string[];
      for (const imageUri of options.productImageUris) {
        const timestamp = Date.now();
        const fileName = `product-${timestamp}-${Math.random().toString(16).slice(2, 8)}.jpg`;
        const imageUrl = await uploadProductImage(product.company, productId, imageUri, fileName);
        uploadedUrls.push(imageUrl);
      }

      await updateItem('products', productId, {
        images: [...(options.imageLinks ?? []), ...uploadedUrls],
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

interface UpdateProductOptions {
  companyId?: string;
  oldBarcodeImageUrl?: string;
  newBarcodeImageUri?: string;
  productImageUris?: string[];
  imageLinks?: string[];
  onUploadProgress?: (progress: number) => void;
}

export async function updateProduct(
  productId: string,
  data: Partial<Omit<Product, 'id' | 'company'>>,
  options: UpdateProductOptions = {}
) {
  try {
    if (options.newBarcodeImageUri) {
      if (!options.companyId) {
        throw new Error('Company ID is required to upload a new barcode image.');
      }

      const timestamp = Date.now();
      const fileName = `barcode-${timestamp}.jpg`;
      const barcodeImageUrl = await uploadBarcodeImage(
        options.companyId,
        productId,
        options.newBarcodeImageUri,
        fileName,
        options.onUploadProgress
      );

      data = {
        ...data,
        barcode: barcodeImageUrl,
      };

      if (options.oldBarcodeImageUrl) {
        await deleteBarcodeImage(options.oldBarcodeImageUrl);
      }
    } else if (!data.barcode && options.oldBarcodeImageUrl) {
      await deleteBarcodeImage(options.oldBarcodeImageUrl);
    }

    const existingImages = Array.isArray(data.images) ? data.images : [];

    if (options.productImageUris && options.productImageUris.length > 0) {
      if (!options.companyId) {
        throw new Error('Company ID is required to upload product images.');
      }

      const uploadedUrls = [] as string[];
      for (const imageUri of options.productImageUris) {
        const timestamp = Date.now();
        const fileName = `product-${timestamp}-${Math.random().toString(16).slice(2, 8)}.jpg`;
        const imageUrl = await uploadProductImage(options.companyId, productId, imageUri, fileName, options.onUploadProgress);
        uploadedUrls.push(imageUrl);
      }

      data = {
        ...data,
        images: [...existingImages, ...(options.imageLinks ?? []), ...uploadedUrls],
      };
    } else if (options.imageLinks) {
      data = {
        ...data,
        images: [...existingImages, ...options.imageLinks],
      };
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
