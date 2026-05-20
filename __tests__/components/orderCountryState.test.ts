import { getVisibleOrderCountry } from '@/app/order/orderCountryState';

describe('orderCountryState', () => {
  it('returns null for missing/empty country', () => {
    expect(getVisibleOrderCountry(undefined)).toBeNull();
    expect(getVisibleOrderCountry(null)).toBeNull();
    expect(getVisibleOrderCountry('')).toBeNull();
  });

  it('returns null for default FI regardless of casing/spacing', () => {
    expect(getVisibleOrderCountry('FI')).toBeNull();
    expect(getVisibleOrderCountry('fi')).toBeNull();
    expect(getVisibleOrderCountry(' Fi ')).toBeNull();
  });

  it('returns normalized country code for non-default countries', () => {
    expect(getVisibleOrderCountry('SE')).toBe('SE');
    expect(getVisibleOrderCountry(' se ')).toBe('SE');
    expect(getVisibleOrderCountry('EE')).toBe('EE');
  });
});
