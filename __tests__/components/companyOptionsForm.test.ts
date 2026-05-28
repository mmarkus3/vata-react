import {
  buildCompanyOptionsPayload,
  toCompanyOptionsFormValues,
  validateCompanyOptionsForm,
} from '@/app/options/companyOptionsForm';

describe('companyOptionsForm', () => {
  it('maps options to editable form values without exposing currencyRate', () => {
    const values = toCompanyOptionsFormValues({
      delivery: 5,
      over: 50,
      vat: 24,
      email: 'orders@example.test',
      vismapay: { apiKey: 'api-key', privateKey: 'private-key' },
      currencyRate: { currency: 'SEK', date: '2026-05-28', rate: 11.2 },
    });

    expect(values).toEqual({
      delivery: '5',
      over: '50',
      vat: '24',
      email: 'orders@example.test',
      vismapayApiKey: 'api-key',
      vismapayPrivateKey: 'private-key',
    });
    expect(values).not.toHaveProperty('currencyRate');
  });

  it('builds a Firestore payload from valid form values', () => {
    expect(buildCompanyOptionsPayload({
      delivery: '5,5',
      over: '50',
      vat: '24',
      email: ' orders@example.test ',
      vismapayApiKey: ' api-key ',
      vismapayPrivateKey: ' private-key ',
    })).toEqual({
      delivery: 5.5,
      over: 50,
      vat: 24,
      email: 'orders@example.test',
      vismapay: { apiKey: 'api-key', privateKey: 'private-key' },
    });
  });

  it('rejects invalid numeric values', () => {
    expect(validateCompanyOptionsForm({
      delivery: 'abc',
      over: '50',
      vat: '24',
      email: '',
      vismapayApiKey: '',
      vismapayPrivateKey: '',
    })).toBe('companyOptions.validation.delivery');
  });
});
