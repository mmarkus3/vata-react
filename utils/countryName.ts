import * as countries from 'i18n-iso-countries';
import finnishCountries from 'i18n-iso-countries/langs/fi.json';

countries.registerLocale(finnishCountries);

export function getCountryNameFromNumericCode(code?: string | null): string | undefined {
  const numericCode = code?.trim();
  if (!numericCode || !/^\d{3}$/.test(numericCode)) {
    return undefined;
  }

  const alpha2Code = countries.numericToAlpha2(numericCode);
  return alpha2Code ? countries.getName(alpha2Code, 'fi') : undefined;
}
