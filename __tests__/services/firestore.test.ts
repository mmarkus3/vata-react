import { normalizeFirestoreData, saveAsItem, saveItem, updateItem } from '@/services/firestore';

const mockAddDoc = jest.fn();
const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockUpdateDoc = jest.fn();

jest.mock('@/services/firebase', () => ({
  firestore: {},
}));

jest.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  deleteDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  runTransaction: jest.fn(),
  where: jest.fn(),
}));

describe('firestore service normalization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCollection.mockReturnValue('collection-ref');
    mockDoc.mockReturnValue('doc-ref');
  });

  it('converts undefined to null recursively and preserves non-undefined values', () => {
    const input = {
      a: undefined,
      b: 1,
      c: 'x',
      d: null,
      e: [undefined, 2, { f: undefined, g: true }],
      h: {
        i: undefined,
        j: 'y',
      },
    };

    const normalized = normalizeFirestoreData(input);

    expect(normalized).toEqual({
      a: null,
      b: 1,
      c: 'x',
      d: null,
      e: [null, 2, { f: null, g: true }],
      h: {
        i: null,
        j: 'y',
      },
    });
  });

  it('preserves Date and timestamp-like values instead of converting them to empty objects', () => {
    const date = new Date('2026-05-19T10:00:00.000Z');
    const timestampLike = { toDate: () => date };

    const normalized = normalizeFirestoreData({
      start: date,
      end: timestampLike,
      nested: { scheduledAt: date },
    });

    expect(normalized).toEqual({
      start: date,
      end: timestampLike,
      nested: { scheduledAt: date },
    });
  });

  it('sanitizes payload in saveItem', async () => {
    mockAddDoc.mockResolvedValue({ id: 'new-id' });

    const id = await saveItem('products', {
      name: 'A',
      retailPrice: undefined,
      nested: { unitPrice: undefined },
    });

    expect(id).toBe('new-id');
    expect(mockAddDoc).toHaveBeenCalledWith('collection-ref', {
      name: 'A',
      retailPrice: null,
      nested: { unitPrice: null },
    });
  });

  it('sanitizes payload in saveAsItem and updateItem', async () => {
    await saveAsItem('products', 'p1', {
      retailPrice: undefined,
      tags: [undefined, 'x'],
    });

    await updateItem('products', 'p1', {
      unitPrice: undefined,
      nutrition: { protein: undefined },
    });

    expect(mockSetDoc).toHaveBeenCalledWith('doc-ref', {
      retailPrice: null,
      tags: [null, 'x'],
    });

    expect(mockUpdateDoc).toHaveBeenCalledWith('doc-ref', {
      unitPrice: null,
      nutrition: { protein: null },
    });
  });
});
