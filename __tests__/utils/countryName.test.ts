import { getCountryNameFromNumericCode } from '@/utils/countryName';

describe('countryName', () => {
  it('resolves ISO 3166-1 numeric codes to English country names', () => {
    expect(getCountryNameFromNumericCode('428')).toBe('Latvia');
    expect(getCountryNameFromNumericCode('246')).toBe('Finland');
    expect(getCountryNameFromNumericCode('752')).toBe('Sweden');
  });

  it('ignores empty, unknown, and non-numeric country codes', () => {
    expect(getCountryNameFromNumericCode('')).toBeUndefined();
    expect(getCountryNameFromNumericCode('999')).toBeUndefined();
    expect(getCountryNameFromNumericCode('FI')).toBeUndefined();
  });
});
