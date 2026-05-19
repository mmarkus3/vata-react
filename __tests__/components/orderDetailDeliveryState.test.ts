import { getDeliveryMethodDisplay, getSelectedPointState } from '@/app/order/orderDetailDeliveryState';

describe('orderDetailDeliveryState', () => {
  it('returns delivery method display when present', () => {
    expect(getDeliveryMethodDisplay({ deliveryMethod: 'pickup' } as any)).toBe('pickup');
    expect(getDeliveryMethodDisplay({ deliveryMethod: '  ' } as any)).toBeNull();
    expect(getDeliveryMethodDisplay(undefined)).toBeNull();
  });

  it('resolves selected point state', () => {
    expect(getSelectedPointState({ isLoading: false, error: null, point: null, hasPointId: false })).toBe('missing');
    expect(getSelectedPointState({ isLoading: true, error: null, point: null, hasPointId: true })).toBe('loading');
    expect(getSelectedPointState({ isLoading: false, error: 'Boom', point: null, hasPointId: true })).toBe('error');
    expect(getSelectedPointState({ isLoading: false, error: null, point: { id: 'p1' }, hasPointId: true } as any)).toBe('success');
  });
});
