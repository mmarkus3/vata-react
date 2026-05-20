export function getVisibleOrderCountry(country: string | null | undefined): string | null {
  const normalized = (country ?? '').trim().toUpperCase();
  if (!normalized || normalized === 'FI') {
    return null;
  }
  return normalized;
}
