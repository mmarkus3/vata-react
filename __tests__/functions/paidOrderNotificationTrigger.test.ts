import { getNotificationReceiverEmail, shouldCreatePaidOrderNotification } from '@/functions/src/on-item/order-status';

describe('paid order company notification trigger helpers', () => {
  it('creates notification only when status transitions to paid', () => {
    expect(shouldCreatePaidOrderNotification({ status: 'placed' } as any, { status: 'paid' } as any)).toBe(true);
    expect(shouldCreatePaidOrderNotification({ status: 'paid' } as any, { status: 'paid' } as any)).toBe(false);
    expect(shouldCreatePaidOrderNotification({ status: 'placed' } as any, { status: 'placed' } as any)).toBe(false);
    expect(shouldCreatePaidOrderNotification(undefined, { status: 'paid' } as any)).toBe(true);
  });

  it('reads receiver email from options/{companyId}.email', () => {
    expect(getNotificationReceiverEmail({ email: ' notify@example.com ' } as any)).toBe('notify@example.com');
    expect(getNotificationReceiverEmail({ email: '   ' } as any)).toBeNull();
    expect(getNotificationReceiverEmail(undefined)).toBeNull();
  });
});
