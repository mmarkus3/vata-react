import { getProductById, updateProduct } from '@/services/product';

const mockGetItem = jest.fn();
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
  saveItem: jest.fn(),
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

  it('returns product with image array on subsequent read after edit', async () => {
    mockGetItem.mockResolvedValue({
      id: 'p1',
      name: 'Coffee',
      amount: 10,
      company: 'co1',
      ean: '123',
      barcode: 'barcode',
      price: 5,
      images: ['https://cdn.example.com/new-image.jpg'],
    });

    const product = await getProductById('p1');

    expect(mockGetItem).toHaveBeenCalledWith('products', 'p1', expect.any(Object));
    expect(product?.images).toEqual(['https://cdn.example.com/new-image.jpg']);
  });
});
