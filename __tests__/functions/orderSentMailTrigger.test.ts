import { shouldCreateSentMail } from '@/functions/src/on-item/order-status';

describe('shouldCreateSentMail', () => {
  it('returns true on transition from non-sent to sent', () => {
    expect(shouldCreateSentMail({ status: 'paid' }, { status: 'sent' })).toBe(true);
    expect(shouldCreateSentMail({ status: 'placed' }, { status: 'sent' })).toBe(true);
  });

  it('returns false when status does not become sent', () => {
    expect(shouldCreateSentMail({ status: 'paid' }, { status: 'paid' })).toBe(false);
    expect(shouldCreateSentMail({ status: 'placed' }, { status: 'paid' })).toBe(false);
  });

  it('returns false when already sent before update', () => {
    expect(shouldCreateSentMail({ status: 'sent' }, { status: 'sent' })).toBe(false);
    expect(shouldCreateSentMail({ status: 'sent' }, { status: 'paid' })).toBe(false);
  });
});
