import {
  applyDateSelection,
  htmlDateToIso,
  isoToHtmlDate,
  normalizePickerDate,
} from '@/app/campaign/campaignCreateModalState';
import { defaultCampaignCreateFormValues } from '@/app/campaign/campaignCreateForm';

describe('campaignCreateModalState', () => {
  it('normalizes date picker value to iso string', () => {
    const date = new Date('2026-05-19T10:00:00.000Z');
    expect(normalizePickerDate(date)).toBe('2026-05-19T10:00:00.000Z');
  });

  it('converts html date to iso and back', () => {
    expect(htmlDateToIso('2026-05-19')).toBe('2026-05-19T00:00:00.000Z');
    expect(isoToHtmlDate('2026-05-19T00:00:00.000Z')).toBe('2026-05-19');
  });

  it('applies selected start/end date to form values', () => {
    const start = new Date('2026-05-20T10:00:00.000Z');
    const end = new Date('2026-05-21T10:00:00.000Z');

    const withStart = applyDateSelection(defaultCampaignCreateFormValues, 'start', start);
    const withEnd = applyDateSelection(withStart, 'end', end);

    expect(withStart.start).toBe('2026-05-20T10:00:00.000Z');
    expect(withEnd.end).toBe('2026-05-21T10:00:00.000Z');
  });
});
