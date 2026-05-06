import { createFullfilment } from '@/services/fullfliment';

const mockRunTransaction = jest.fn();
const mockGetDocumentRef = jest.fn();
const mockCreateDocumentRef = jest.fn();

jest.mock('@/services/firestore', () => ({
  runInTransaction: (...args: unknown[]) => mockRunTransaction(...args),
  getDocumentRef: (...args: unknown[]) => mockGetDocumentRef(...args),
  createDocumentRef: (...args: unknown[]) => mockCreateDocumentRef(...args),
  getItems: jest.fn(),
  whereEqual: jest.fn(),
}));

describe('createFullfilment', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('creates fullfilment and decrements stock in a single transaction', async () => {
    const transaction = {
      get: jest.fn(),
      update: jest.fn(),
      set: jest.fn(),
    };

    const p1Ref = { id: 'p1' };
    const p2Ref = { id: 'p2' };
    const fullfilmentRef = { id: 'full-1' };

    mockGetDocumentRef.mockImplementation((collectionKey: string, id: string) => {
      if (collectionKey === 'products' && id === 'p1') return p1Ref;
      if (collectionKey === 'products' && id === 'p2') return p2Ref;
      return { id };
    });
    mockCreateDocumentRef.mockReturnValue(fullfilmentRef);

    transaction.get
      .mockResolvedValueOnce({ exists: () => true, data: () => ({ amount: 10 }) })
      .mockResolvedValueOnce({ exists: () => true, data: () => ({ amount: 7 }) });

    mockRunTransaction.mockImplementation(async (fn: (tx: typeof transaction) => Promise<string>) => fn(transaction));

    const payload = {
      client: { guid: 'c1', name: 'Client' },
      company: 'co1',
      date: new Date().toISOString(),
      products: [
        { amount: 3, product: { guid: 'p1', name: 'Tuote 1', ean: '111', price: 10 } },
        { amount: 2, product: { guid: 'p2', name: 'Tuote 2', ean: '222', price: 15 } },
      ],
    };

    const id = await createFullfilment(payload);

    expect(id).toBe('full-1');
    expect(transaction.update).toHaveBeenCalledWith(p1Ref, { amount: 7 });
    expect(transaction.update).toHaveBeenCalledWith(p2Ref, { amount: 5 });
    expect(transaction.set).toHaveBeenCalledWith(fullfilmentRef, payload);
  });

  it('rejects when stock is insufficient and does not write updates', async () => {
    const transaction = {
      get: jest.fn(),
      update: jest.fn(),
      set: jest.fn(),
    };

    const p1Ref = { id: 'p1' };
    mockGetDocumentRef.mockReturnValue(p1Ref);
    mockCreateDocumentRef.mockReturnValue({ id: 'full-2' });

    transaction.get.mockResolvedValueOnce({ exists: () => true, data: () => ({ amount: 1 }) });
    mockRunTransaction.mockImplementation(async (fn: (tx: typeof transaction) => Promise<string>) => fn(transaction));

    const payload = {
      client: { guid: 'c1', name: 'Client' },
      company: 'co1',
      date: new Date().toISOString(),
      products: [{ amount: 3, product: { guid: 'p1', name: 'Tuote 1', ean: '111', price: 10 } }],
    };

    await expect(createFullfilment(payload)).rejects.toThrow('Varastosaldo ei riitä tuotteelle');
    expect(transaction.update).not.toHaveBeenCalled();
    expect(transaction.set).not.toHaveBeenCalled();
  });

  it('maps transaction errors without partial writes', async () => {
    mockRunTransaction.mockRejectedValue(new Error('Network down'));

    const payload = {
      client: { guid: 'c1', name: 'Client' },
      company: 'co1',
      date: new Date().toISOString(),
      products: [{ amount: 1, product: { guid: 'p1', name: 'Tuote 1', ean: '111', price: 10 } }],
    };

    await expect(createFullfilment(payload)).rejects.toThrow('Network down');
  });
});
