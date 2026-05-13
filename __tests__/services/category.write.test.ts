import { createCategory, updateCategory } from '@/services/category';

const mockSaveItem = jest.fn();
const mockUpdateItem = jest.fn();

jest.mock('@/services/firestore', () => ({
  getSnapshotItems: jest.fn(),
  whereEqual: jest.fn(),
  saveItem: (...args: unknown[]) => mockSaveItem(...args),
  updateItem: (...args: unknown[]) => mockUpdateItem(...args),
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
});
