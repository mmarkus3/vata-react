import { createFullfilment, updateFullfilmentWithProducts } from '@/services/fullfliment';

const mockSaveItem = jest.fn();
const mockSaveAsItem = jest.fn();

jest.mock('@/services/firestore', () => ({
  createDocumentRef: jest.fn(),
  getItems: jest.fn(),
  saveAsItem: (...args: unknown[]) => mockSaveAsItem(...args),
  saveItem: (...args: unknown[]) => mockSaveItem(...args),
  updateItem: jest.fn(),
  whereEqual: jest.fn(),
}));

describe('fullfilment service persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates fullfilment document without client-side stock mutation transaction', async () => {
    mockSaveItem.mockResolvedValueOnce('full-1');
    const payload = {
      client: { guid: 'c1', name: 'Client' },
      company: 'co1',
      date: new Date().toISOString(),
      products: [{ amount: 2, product: { guid: 'p1', name: 'P1', ean: '111', price: 1 } }],
    };

    const id = await createFullfilment(payload as any);
    expect(id).toBe('full-1');
    expect(mockSaveItem).toHaveBeenCalledWith('fullfilments', payload);
  });

  it('updates fullfilment document by id without client-side product stock writes', async () => {
    mockSaveAsItem.mockResolvedValueOnce(undefined);
    const updated = {
      client: { guid: 'c1', name: 'Client' },
      company: 'co1',
      date: new Date().toISOString(),
      products: [{ amount: 4, product: { guid: 'p1', name: 'P1', ean: '111', price: 1 } }],
    };

    const id = await updateFullfilmentWithProducts(
      'f1',
      {
        id: 'f1',
        client: { guid: 'c1', name: 'Client' },
        company: 'co1',
        date: new Date().toISOString(),
        products: [{ amount: 1, product: { guid: 'p1', name: 'P1', ean: '111', price: 1 } }],
      } as any,
      updated as any
    );

    expect(id).toBe('f1');
    expect(mockSaveAsItem).toHaveBeenCalledWith('fullfilments', 'f1', updated);
  });
});
