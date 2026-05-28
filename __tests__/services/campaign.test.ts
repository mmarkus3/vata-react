import { createCampaign, deleteCampaign, getCampaignById, updateCampaign } from '@/services/campaign';

const mockDeleteItem = jest.fn();
const mockGetItem = jest.fn();
const mockSaveItem = jest.fn();
const mockUpdateItem = jest.fn();
const mockGetSnapshotItems = jest.fn();
const mockWhereEqual = jest.fn();

jest.mock('@/services/firestore', () => ({
  deleteItem: (...args: unknown[]) => mockDeleteItem(...args),
  getItem: (...args: unknown[]) => mockGetItem(...args),
  getSnapshotItems: (...args: unknown[]) => mockGetSnapshotItems(...args),
  saveItem: (...args: unknown[]) => mockSaveItem(...args),
  updateItem: (...args: unknown[]) => mockUpdateItem(...args),
  whereEqual: (...args: unknown[]) => mockWhereEqual(...args),
}));

describe('campaign service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates, fetches and updates campaigns using the campaigns collection', async () => {
    mockSaveItem.mockResolvedValue('new-campaign');
    mockGetItem.mockResolvedValue({ id: 'campaign-1', name: 'Summer' });
    mockUpdateItem.mockResolvedValue(undefined);

    await expect(createCampaign({
      company: 'company-1',
      name: 'Summer',
      products: [],
      discountType: 'percentage',
      discountValue: 10,
      start: new Date('2026-06-01'),
      end: new Date('2026-06-30'),
    })).resolves.toBe('new-campaign');
    await expect(getCampaignById('campaign-1')).resolves.toEqual({ id: 'campaign-1', name: 'Summer' });
    await updateCampaign('campaign-1', { name: 'Updated Summer' });

    expect(mockSaveItem).toHaveBeenCalledWith('campaigns', expect.objectContaining({ name: 'Summer' }));
    expect(mockGetItem).toHaveBeenCalledWith('campaigns', 'campaign-1', expect.any(Object));
    expect(mockUpdateItem).toHaveBeenCalledWith('campaigns', 'campaign-1', { name: 'Updated Summer' });
  });

  it('deletes campaign successfully', async () => {
    mockDeleteItem.mockResolvedValue(undefined);

    await deleteCampaign('campaign-1');

    expect(mockDeleteItem).toHaveBeenCalledWith('campaigns', 'campaign-1');
  });

  it('maps delete errors', async () => {
    mockDeleteItem.mockRejectedValue(new Error('permission denied'));

    await expect(deleteCampaign('campaign-1')).rejects.toThrow('permission denied');
  });
});
