import { createClient, deleteClient, getClientById, updateClient } from '@/services/client';

const mockGetItem = jest.fn();
const mockSaveItem = jest.fn();
const mockUpdateItem = jest.fn();
const mockDeleteItem = jest.fn();
const mockGetSnapshotItems = jest.fn();
const mockWhereEqual = jest.fn();

jest.mock('@/services/firestore', () => ({
  getItem: (...args: unknown[]) => mockGetItem(...args),
  saveItem: (...args: unknown[]) => mockSaveItem(...args),
  updateItem: (...args: unknown[]) => mockUpdateItem(...args),
  deleteItem: (...args: unknown[]) => mockDeleteItem(...args),
  getSnapshotItems: (...args: unknown[]) => mockGetSnapshotItems(...args),
  whereEqual: (...args: unknown[]) => mockWhereEqual(...args),
}));

describe('client service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('updates client successfully', async () => {
    mockUpdateItem.mockResolvedValue(undefined);

    await updateClient('c1', { name: 'New Name' });

    expect(mockUpdateItem).toHaveBeenCalledWith('clients', 'c1', { name: 'New Name' });
  });

  it('deletes client successfully', async () => {
    mockDeleteItem.mockResolvedValue(undefined);

    await deleteClient('c1');

    expect(mockDeleteItem).toHaveBeenCalledWith('clients', 'c1');
  });

  it('maps update errors', async () => {
    mockUpdateItem.mockRejectedValue(new Error('boom'));

    await expect(updateClient('c1', { name: 'X' })).rejects.toThrow('boom');
  });

  it('maps delete errors', async () => {
    mockDeleteItem.mockRejectedValue(new Error('nope'));

    await expect(deleteClient('c1')).rejects.toThrow('nope');
  });

  it('creates and fetches clients using expected keys', async () => {
    mockSaveItem.mockResolvedValue('new-id');
    mockGetItem.mockResolvedValue({ id: 'c1', name: 'A' });

    const created = await createClient({
      name: 'A',
      company: 'co',
      address: { street: '', postalCode: '', city: '' },
      phone: '',
      email: 'a@a.fi',
    });
    const fetched = await getClientById('c1');

    expect(created).toBe('new-id');
    expect(fetched).toEqual({ id: 'c1', name: 'A' });
    expect(mockSaveItem).toHaveBeenCalledWith('clients', expect.any(Object));
    expect(mockGetItem).toHaveBeenCalledWith('clients', 'c1');
  });
});
