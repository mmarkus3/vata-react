import { getOrderDetailsRoute } from '@/app/order/orderRoute';

describe('orderRoute', () => {
  it('builds order detail route from order id', () => {
    expect(getOrderDetailsRoute('ord-123')).toBe('/order/ord-123');
  });
});
