import { getOrderById, markOrderAsSent } from '@/services/order';

const mockGetItem = jest.fn();
const mockUpdateItem = jest.fn();

jest.mock('@/services/firestore', () => ({
  getItem: (...args: unknown[]) => mockGetItem(...args),
  getSnapshotItems: jest.fn(),
  updateItem: (...args: unknown[]) => mockUpdateItem(...args),
  whereEqual: jest.fn(),
  whereIn: jest.fn(),
}));

describe('markOrderAsSent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates order status to sent when company matches', async () => {
    mockGetItem.mockResolvedValueOnce({ id: 'order-1', company: 'company-1' });

    await markOrderAsSent('company-1', 'order-1');

    expect(mockUpdateItem).toHaveBeenCalledWith('orders', 'order-1', { status: 'sent' });
  });

  it('throws for company mismatch', async () => {
    mockGetItem.mockResolvedValueOnce({ id: 'order-1', company: 'other-company' });

    await expect(markOrderAsSent('company-1', 'order-1')).rejects.toThrow('Company mismatch');
    expect(mockUpdateItem).not.toHaveBeenCalled();
  });

  it('throws when order does not exist', async () => {
    mockGetItem.mockResolvedValueOnce(null);

    await expect(markOrderAsSent('company-1', 'order-1')).rejects.toThrow('Order not found');
    expect(mockUpdateItem).not.toHaveBeenCalled();
  });

  it('keeps getOrderById behavior available', async () => {
    mockGetItem.mockResolvedValueOnce({ id: 'o1', company: 'c1' });
    const order = await getOrderById('o1');
    expect(order?.id).toBe('o1');
  });
});
