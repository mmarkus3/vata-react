import type { CampaignCreateFormValues } from '@/app/campaign/campaignCreateForm';

export const normalizePickerDate = (date: Date): string => date.toISOString();

export const htmlDateToIso = (value: string): string => {
  if (!value) return '';
  return new Date(`${value}T00:00:00.000Z`).toISOString();
};

export const isoToHtmlDate = (value: string): string => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

export const applyDateSelection = (
  values: CampaignCreateFormValues,
  field: 'start' | 'end',
  date: Date,
): CampaignCreateFormValues => ({
  ...values,
  [field]: normalizePickerDate(date),
});
