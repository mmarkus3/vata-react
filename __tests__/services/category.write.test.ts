import { createCategory, getCategoryById, updateCategory } from '@/services/category';

const mockSaveItem = jest.fn();
const mockUpdateItem = jest.fn();
const mockGetItem = jest.fn();

jest.mock('@/services/firestore', () => ({
  getSnapshotItems: jest.fn(),
  whereEqual: jest.fn(),
  saveItem: (...args: unknown[]) => mockSaveItem(...args),
  updateItem: (...args: unknown[]) => mockUpdateItem(...args),
  getItem: (...args: unknown[]) => mockGetItem(...args),
  deleteItem: jest.fn(),
}));

describe('category write flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates category with expected payload', async () => {
    mockSaveItem.mockResolvedValue('cat-1');

    const id = await createCategory(' Snacks ', ' Salty items ', 'co-1');

    expect(id).toBe('cat-1');
    expect(mockSaveItem).toHaveBeenCalledWith(
      'categories',
      expect.objectContaining({
        name: 'Snacks',
        description: 'Salty items',
        company: 'co-1',
      })
    );
  });

  it('updates category with expected payload', async () => {
    mockUpdateItem.mockResolvedValue(undefined);

    await updateCategory('cat-1', ' Drinks ', ' Beverages ');

    expect(mockUpdateItem).toHaveBeenCalledWith(
      'categories',
      'cat-1',
      expect.objectContaining({
        name: 'Drinks',
        description: 'Beverages',
      })
    );
  });

  it('gets category by id', async () => {
    mockGetItem.mockResolvedValue({ id: 'cat-1', name: 'Snacks', description: '', company: 'co-1' });

    const result = await getCategoryById('cat-1');

    expect(result).toEqual({ id: 'cat-1', name: 'Snacks', description: '', company: 'co-1' });
    expect(mockGetItem).toHaveBeenCalledWith('categories', 'cat-1');
  });
});
