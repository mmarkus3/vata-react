import {
  buildCampaignCreatePayload,
  buildCampaignMode,
  defaultCampaignCreateFormValues,
  validateCampaignCreateForm,
} from '@/app/campaign/campaignCreateForm';

describe('campaignCreateForm', () => {
  const products = [
    { id: 'p1', name: 'Milk', category: 'c1' },
    { id: 'p2', name: 'Bread', category: 'c2' },
  ] as any[];

  it('builds mode from optional code', () => {
    expect(buildCampaignMode('SAVE10')).toBe('code');
    expect(buildCampaignMode('  ')).toBe('auto');
  });

  it('validates required fields and rules', () => {
    expect(validateCampaignCreateForm(defaultCampaignCreateFormValues)).toBe('campaigns.create.errors.nameRequired');

    expect(
      validateCampaignCreateForm({
        ...defaultCampaignCreateFormValues,
        name: 'Spring',
        start: '2026-05-20T10:00:00.000Z',
        end: '2026-05-19T10:00:00.000Z',
        discountValue: '10',
      }),
    ).toBe('campaigns.create.errors.invalidDateRange');

    expect(
      validateCampaignCreateForm({
        ...defaultCampaignCreateFormValues,
        name: 'Spring',
        start: '2026-05-19T10:00:00.000Z',
        end: '2026-05-20T10:00:00.000Z',
        targetingMode: 'selected',
        selectedProductIds: [],
        discountValue: '10',
      }),
    ).toBe('campaigns.create.errors.productsRequired');
  });

  it('builds payload for selected products + percentage discount', () => {
    const payload = buildCampaignCreatePayload({
      values: {
        ...defaultCampaignCreateFormValues,
        name: 'Spring',
        code: 'SAVE10',
        start: '2026-05-19T10:00:00.000Z',
        end: '2026-05-20T10:00:00.000Z',
        targetingMode: 'selected',
        selectedProductIds: ['p1'],
        discountType: 'percentage',
        discountValue: '10',
      },
      company: 'cmp-1',
      products: products as any,
    });

    expect(payload.company).toBe('cmp-1');
    expect(payload.mode).toBe('code');
    expect(payload.targetingMode).toBe('selected');
    expect(payload.products).toEqual([{ id: 'p1', name: 'Milk', discountPercentage: 10, discountFixed: undefined }]);
  });

  it('builds payload for category + fixed discount', () => {
    const payload = buildCampaignCreatePayload({
      values: {
        ...defaultCampaignCreateFormValues,
        name: 'NoCode',
        code: '',
        start: '2026-05-19T10:00:00.000Z',
        end: '2026-05-20T10:00:00.000Z',
        targetingMode: 'category',
        categoryId: 'c1',
        discountType: 'fixed',
        discountValue: '4.5',
      },
      company: 'cmp-1',
      products: products as any,
    });

    expect(payload.mode).toBe('auto');
    expect(payload.products).toEqual([{ id: 'p1', name: 'Milk', discountPercentage: undefined, discountFixed: 4.5 }]);
  });
});
