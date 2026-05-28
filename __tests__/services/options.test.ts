import { getCompanyOptions, stripUndefinedFields, updateCompanyOptions } from '@/services/options';

const mockDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn();

jest.mock('@/services/firebase', () => ({
  firestore: { app: 'mock-firestore' },
}));

jest.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}));

describe('options service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDoc.mockReturnValue({ path: 'options/company-1' });
  });

  it('fetches company options from company-scoped options document', async () => {
    const options = { delivery: 5, over: 50, vat: 24, email: 'orders@example.test' };
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => options,
    });

    await expect(getCompanyOptions('company-1')).resolves.toEqual(options);

    expect(mockDoc).toHaveBeenCalledWith({ app: 'mock-firestore' }, 'options', 'company-1');
    expect(mockGetDoc).toHaveBeenCalledWith({ path: 'options/company-1' });
  });

  it('returns null when options document does not exist', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false });

    await expect(getCompanyOptions('company-1')).resolves.toBeNull();
  });

  it('saves editable options with merge semantics and excludes currencyRate', async () => {
    await updateCompanyOptions('company-1', {
      delivery: 7,
      over: 70,
      vat: 25.5,
      email: 'orders@example.test',
      vismapay: {
        apiKey: 'api-key',
        privateKey: undefined as unknown as string,
      },
      currencyRate: { currency: 'SEK', date: '2026-05-28', rate: 11.2 },
    } as any);

    expect(mockSetDoc).toHaveBeenCalledWith(
      { path: 'options/company-1' },
      {
        delivery: 7,
        over: 70,
        vat: 25.5,
        email: 'orders@example.test',
        vismapay: { apiKey: 'api-key' },
      },
      { merge: true },
    );
  });

  it('strips nested undefined values without changing defined values', () => {
    expect(stripUndefinedFields({ keep: 1, skip: undefined, nested: { keep: 'yes', skip: undefined } })).toEqual({
      keep: 1,
      nested: { keep: 'yes' },
    });
  });
});
