import { createProduct, getProductById, updateProduct } from '@/services/product';

const mockGetItem = jest.fn();
const mockSaveItem = jest.fn();
const mockUpdateItem = jest.fn();
const mockUploadProductImage = jest.fn();
const mockUploadBarcodeImage = jest.fn();
const mockDeleteBarcodeImage = jest.fn();

jest.mock('firebase/firestore', () => ({
  where: jest.fn(),
}));

jest.mock('@/services/firestore', () => ({
  getItem: (...args: unknown[]) => mockGetItem(...args),
  updateItem: (...args: unknown[]) => mockUpdateItem(...args),
  saveItem: (...args: unknown[]) => mockSaveItem(...args),
  deleteItem: jest.fn(),
  getSnapshotItems: jest.fn(),
}));

jest.mock('@/services/storage', () => ({
  uploadProductImage: (...args: unknown[]) => mockUploadProductImage(...args),
  uploadBarcodeImage: (...args: unknown[]) => mockUploadBarcodeImage(...args),
  deleteBarcodeImage: (...args: unknown[]) => mockDeleteBarcodeImage(...args),
}));

describe('product service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('merges existing, URL, and uploaded product images on update', async () => {
    mockUploadProductImage
      .mockResolvedValueOnce('https://cdn.example.com/uploaded-1.jpg')
      .mockResolvedValueOnce('https://cdn.example.com/uploaded-2.jpg');
    mockUpdateItem.mockResolvedValue(undefined);

    await updateProduct(
      'p1',
      {
        images: ['https://cdn.example.com/existing.jpg'],
      },
      {
        companyId: 'co1',
        imageLinks: ['https://cdn.example.com/link.jpg'],
        productImageUris: ['file://img-1.jpg', 'file://img-2.jpg'],
      }
    );

    expect(mockUploadProductImage).toHaveBeenCalledTimes(2);
    expect(mockUpdateItem).toHaveBeenCalledWith('products', 'p1', {
      images: [
        'https://cdn.example.com/existing.jpg',
        'https://cdn.example.com/link.jpg',
        'https://cdn.example.com/uploaded-1.jpg',
        'https://cdn.example.com/uploaded-2.jpg',
      ],
    });
  });

  it('creates product with retail and unit prices and supports optional empty values', async () => {
    mockSaveItem.mockResolvedValueOnce('p1').mockResolvedValueOnce('p2');
    mockUpdateItem.mockResolvedValue(undefined);

    await createProduct({
      name: 'Product A',
      amount: 10,
      price: 5.5,
      retailPrice: 6.9,
      unitPrice: 10.2,
      barcode: '',
      ean: '',
      company: 'co1',
      images: [],
    });

    await createProduct({
      name: 'Product B',
      amount: 5,
      price: 4.2,
      barcode: '',
      ean: '',
      company: 'co1',
      images: [],
    });

    expect(mockSaveItem).toHaveBeenNthCalledWith(
      1,
      'products',
      expect.objectContaining({ retailPrice: 6.9, unitPrice: 10.2 })
    );
    expect(mockSaveItem).toHaveBeenNthCalledWith(
      2,
      'products',
      expect.not.objectContaining({ retailPrice: expect.anything(), unitPrice: expect.anything() })
    );
  });

  it('creates product with nutrition fields and supports partial optional values', async () => {
    mockSaveItem.mockResolvedValueOnce('p3').mockResolvedValueOnce('p4');

    await createProduct({
      name: 'Product C',
      amount: 3,
      price: 2.1,
      energyJoule: 123,
      energyCalory: 29,
      fat: 1.2,
      saturatedFat: 0.3,
      carbohydrate: 5.5,
      saturatedCarbohydrate: 2.1,
      protein: 0.8,
      salt: 0.2,
      fiber: 1.0,
      barcode: '',
      ean: '',
      company: 'co1',
      images: [],
    });

    await createProduct({
      name: 'Product D',
      amount: 4,
      price: 2.8,
      energyJoule: 150,
      protein: 1.1,
      barcode: '',
      ean: '',
      company: 'co1',
      images: [],
    });

    expect(mockSaveItem).toHaveBeenNthCalledWith(
      1,
      'products',
      expect.objectContaining({
        energyJoule: 123,
        energyCalory: 29,
        fat: 1.2,
        saturatedFat: 0.3,
        carbohydrate: 5.5,
        saturatedCarbohydrate: 2.1,
        protein: 0.8,
        salt: 0.2,
        fiber: 1.0,
      })
    );
    expect(mockSaveItem).toHaveBeenNthCalledWith(
      2,
      'products',
      expect.objectContaining({
        energyJoule: 150,
        protein: 1.1,
      })
    );
  });

  it('updates existing product retail and unit prices', async () => {
    mockUpdateItem.mockResolvedValue(undefined);

    await updateProduct('p1', {
      retailPrice: 7.5,
      unitPrice: 11.9,
    });

    expect(mockUpdateItem).toHaveBeenCalledWith('products', 'p1', {
      retailPrice: 7.5,
      unitPrice: 11.9,
    });
  });

  it('updates existing product nutrition fields', async () => {
    mockUpdateItem.mockResolvedValue(undefined);

    await updateProduct('p1', {
      energyJoule: 200,
      energyCalory: 48,
      fat: 3.1,
      saturatedFat: 1.4,
      carbohydrate: 8.9,
      saturatedCarbohydrate: 4.4,
      protein: 2.2,
      salt: 0.5,
      fiber: 1.7,
    });

    expect(mockUpdateItem).toHaveBeenCalledWith('products', 'p1', {
      energyJoule: 200,
      energyCalory: 48,
      fat: 3.1,
      saturatedFat: 1.4,
      carbohydrate: 8.9,
      saturatedCarbohydrate: 4.4,
      protein: 2.2,
      salt: 0.5,
      fiber: 1.7,
    });
  });

  it('returns product with image array on subsequent read after edit', async () => {
    mockGetItem.mockResolvedValue({
      id: 'p1',
      name: 'Coffee',
      amount: 10,
      company: 'co1',
      ean: '123',
      barcode: 'barcode',
      price: 5,
      retailPrice: 7.5,
      unitPrice: 11.9,
      energyJoule: 180,
      energyCalory: 43,
      fat: 2.4,
      saturatedFat: 1.1,
      carbohydrate: 7.2,
      saturatedCarbohydrate: 3.3,
      protein: 1.9,
      salt: 0.4,
      fiber: 0.9,
      images: ['https://cdn.example.com/new-image.jpg'],
    });

    const product = await getProductById('p1');

    expect(mockGetItem).toHaveBeenCalledWith('products', 'p1', expect.any(Object));
    expect(product?.images).toEqual(['https://cdn.example.com/new-image.jpg']);
    expect(product?.retailPrice).toBe(7.5);
    expect(product?.unitPrice).toBe(11.9);
    expect(product?.energyJoule).toBe(180);
    expect(product?.energyCalory).toBe(43);
    expect(product?.fat).toBe(2.4);
    expect(product?.saturatedFat).toBe(1.1);
    expect(product?.carbohydrate).toBe(7.2);
    expect(product?.saturatedCarbohydrate).toBe(3.3);
    expect(product?.protein).toBe(1.9);
    expect(product?.salt).toBe(0.4);
    expect(product?.fiber).toBe(0.9);
  });
});
