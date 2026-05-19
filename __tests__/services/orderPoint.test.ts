jest.mock('@/services/firestore', () => ({
  getItem: jest.fn(),
  getSnapshotItems: jest.fn(),
  whereEqual: jest.fn(),
}));

import { getSelectedPointInfo, resolveOrderPointId } from '@/services/order';

describe('order point helpers', () => {
  it('resolves point id from supported fields', () => {
    expect(resolveOrderPointId({ pointId: 'p1' } as any)).toBe('p1');
    expect(resolveOrderPointId({ deliveryPointId: 'p2' } as any)).toBe('p2');
    expect(resolveOrderPointId({ pickupPointId: 'p3' } as any)).toBe('p3');
    expect(resolveOrderPointId({ point_id: 'p4' } as any)).toBe('p4');
    expect(resolveOrderPointId({} as any)).toBeNull();
  });

  it('fetches selected point info from configured backend endpoint', async () => {
    process.env.EXPO_PUBLIC_FIREBASE_API = 'https://api.example.com';
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ name: 'Point A', address: 'Street 1', city: 'Helsinki', postalCode: '00100' }),
    });

    const originalFetch = global.fetch;
    // @ts-expect-error test mock
    global.fetch = fetchMock;

    const result = await getSelectedPointInfo('company-1', 'point-1');

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/orders/company/company-1/point/point-1');
    expect(result).toEqual({
      id: 'point-1',
      name: 'Point A',
      address: 'Street 1',
      city: 'Helsinki',
      postalCode: '00100',
    });

    global.fetch = originalFetch;
  });
});
