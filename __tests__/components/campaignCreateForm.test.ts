import {
  applyBulkDiscountFixedValue,
  buildCampaignCreatePayload,
  buildCampaignMode,
  defaultCampaignCreateFormValues,
  mapCampaignToFormValues,
  syncDiscountFixedValues,
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

  it('maps campaign to form values for edit prefill', () => {
    const mapped = mapCampaignToFormValues({
      name: 'Spring',
      code: 'SAVE10',
      start: new Date('2026-05-19T10:00:00.000Z'),
      end: new Date('2026-05-20T10:00:00.000Z'),
      targetingMode: 'selected',
      selectedProductIds: ['p1'],
      categoryId: '',
      discountType: 'percentage',
      discountValue: 10,
      products: [{ id: 'p1', name: 'Milk', discountPercentage: 10, discountFixed: 4.25 }],
      company: 'cmp-1',
    } as any);

    expect(mapped.name).toBe('Spring');
    expect(mapped.code).toBe('SAVE10');
    expect(mapped.selectedProductIds).toEqual(['p1']);
    expect(mapped.discountValue).toBe('10');
    expect(mapped.discountFixedValues).toEqual({ p1: '4.25' });
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
        discountFixedValues: { p1: '4.5' },
      },
      company: 'cmp-1',
      products: products as any,
    });

    expect(payload.mode).toBe('auto');
    expect(payload.products).toEqual([{ id: 'p1', name: 'Milk', discountPercentage: undefined, discountFixed: 4.5 }]);
  });

  it('requires per-product fixed values in fixed mode', () => {
    expect(
      validateCampaignCreateForm(
        {
          ...defaultCampaignCreateFormValues,
          name: 'Fixed Promo',
          start: '2026-05-19T10:00:00.000Z',
          end: '2026-05-20T10:00:00.000Z',
          targetingMode: 'selected',
          selectedProductIds: ['p1'],
          discountType: 'fixed',
          discountFixedValues: {},
        },
        products as any,
      ),
    ).toBe('campaigns.create.errors.discountInvalid');
  });

  it('builds payload for selected products + fixed values per product', () => {
    const payload = buildCampaignCreatePayload({
      values: {
        ...defaultCampaignCreateFormValues,
        name: 'Per Product',
        start: '2026-05-19T10:00:00.000Z',
        end: '2026-05-20T10:00:00.000Z',
        targetingMode: 'selected',
        selectedProductIds: ['p1', 'p2'],
        discountType: 'fixed',
        discountFixedValues: { p1: '2.5', p2: '3.75' },
      },
      company: 'cmp-1',
      products: products as any,
    });

    expect(payload.products).toEqual([
      { id: 'p1', name: 'Milk', discountPercentage: undefined, discountFixed: 2.5 },
      { id: 'p2', name: 'Bread', discountPercentage: undefined, discountFixed: 3.75 },
    ]);
  });

  it('applies one fixed value to all targeted products', () => {
    const result = applyBulkDiscountFixedValue(
      {
        ...defaultCampaignCreateFormValues,
        targetingMode: 'selected',
        selectedProductIds: ['p1', 'p2'],
        discountType: 'fixed',
        discountFixedBulkValue: '4.2',
      },
      products as any,
    );

    expect(result?.discountFixedValues).toEqual({ p1: '4.2', p2: '4.2' });
  });

  it('returns null when bulk fixed value is invalid', () => {
    const result = applyBulkDiscountFixedValue(
      {
        ...defaultCampaignCreateFormValues,
        targetingMode: 'selected',
        selectedProductIds: ['p1'],
        discountType: 'fixed',
        discountFixedBulkValue: '',
      },
      products as any,
    );

    expect(result).toBeNull();
  });

  it('preserves per-product overrides until bulk apply runs again', () => {
    const firstApply = applyBulkDiscountFixedValue(
      {
        ...defaultCampaignCreateFormValues,
        targetingMode: 'selected',
        selectedProductIds: ['p1', 'p2'],
        discountType: 'fixed',
        discountFixedBulkValue: '5',
      },
      products as any,
    );

    const withManualOverride = {
      ...(firstApply as any),
      discountFixedValues: { ...(firstApply as any).discountFixedValues, p2: '6' },
    };

    const synced = syncDiscountFixedValues(withManualOverride, products as any);
    expect(synced.discountFixedValues).toEqual({ p1: '5', p2: '6' });
  });
});
