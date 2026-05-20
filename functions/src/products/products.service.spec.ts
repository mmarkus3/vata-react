import { Test, TestingModule } from '@nestjs/testing';
import { firestore } from 'firebase-admin';
import { getRate } from '../currency/currency';
import { ProductsService } from './products.service';

jest.mock('firebase-admin', () => ({
  firestore: jest.fn(),
}));
jest.mock('../currency/currency', () => ({
  getRate: jest.fn(),
}));

describe('ProductsService', () => {
  let service: ProductsService;
  const mockDocGet = jest.fn();
  const mockCollectionGetProducts = jest.fn();
  const mockCollectionGetCampaigns = jest.fn();
  const mockCollection = jest.fn((name: string) => ({
    where: jest.fn(() => ({
      get: name === 'campaigns' ? mockCollectionGetCampaigns : mockCollectionGetProducts,
    })),
  }));
  const mockDoc = jest.fn(() => ({ get: mockDocGet }));

  beforeEach(async () => {
    jest.clearAllMocks();
    (getRate as jest.Mock).mockResolvedValue({ rate: 10.5 });
    (firestore as unknown as jest.Mock).mockReturnValue({
      doc: mockDoc,
      collection: mockCollection,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('includes lowestRetailPriceLast30Days in detail response', async () => {
    mockDocGet
      .mockResolvedValueOnce({ data: () => ({ vat: 14 }) })
      .mockResolvedValueOnce({
        data: () => ({
          company: 'co1',
          showInWebshop: true,
          name: 'Coffee',
          amount: 10,
          retailPrice: 7.5,
          retailPriceHistory: [
            { price: 8.2, changedAt: '2026-05-10T12:00:00.000Z' },
            { price: 6.9, changedAt: '2026-05-01T12:00:00.000Z' },
          ],
        }),
      });
    mockCollectionGetCampaigns.mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            company: 'co1',
            code: '',
            start: '2026-05-01T00:00:00.000Z',
            end: '2026-06-30T00:00:00.000Z',
            discountType: 'fixed',
            products: [{ id: 'p1', discountFixed: 6.2 }],
          }),
        },
      ],
    });

    const result = await service.getProductByIdAndCompany('co1', 'p1');
    expect(result.lowestRetailPriceLast30Days).toBe(6.9);
    expect(result.discountPrice).toBe(6.2);
  });

  it('includes lowestRetailPriceLast30Days in list response and keeps null fallback', async () => {
    mockDocGet.mockResolvedValueOnce({ data: () => ({ vat: 14 }) });
    mockCollectionGetCampaigns.mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            company: 'co1',
            code: '',
            start: '2026-05-01T00:00:00.000Z',
            end: '2026-06-30T00:00:00.000Z',
            discountType: 'percentage',
            products: [{ id: 'p1', discountPercentage: 10 }],
          }),
        },
        {
          data: () => ({
            company: 'co1',
            code: '',
            start: '2026-05-01T00:00:00.000Z',
            end: '2026-06-30T00:00:00.000Z',
            discountType: 'fixed',
            products: [{ id: 'p1', discountFixed: 4.6 }],
          }),
        },
        {
          data: () => ({
            company: 'co1',
            code: 'SAVE10',
            start: '2026-05-01T00:00:00.000Z',
            end: '2026-06-30T00:00:00.000Z',
            discountType: 'fixed',
            products: [{ id: 'p1', discountFixed: 1.5 }],
          }),
        },
        {
          data: () => ({
            company: 'co1',
            code: '',
            start: '2020-01-01T00:00:00.000Z',
            end: '2020-02-01T00:00:00.000Z',
            discountType: 'fixed',
            products: [{ id: 'p1', discountFixed: 1.0 }],
          }),
        },
      ],
    });
    mockCollectionGetProducts.mockResolvedValueOnce({
      docs: [
        {
          id: 'p1',
          data: () => ({
            company: 'co1',
            showInWebshop: true,
            name: 'Milk',
            amount: 4,
            retailPrice: 5.5,
            retailPriceHistory: [{ price: 4.9, changedAt: '2026-05-01T12:00:00.000Z' }],
          }),
        },
        {
          id: 'p2',
          data: () => ({
            company: 'co1',
            showInWebshop: true,
            name: 'Water',
            amount: 12,
            retailPrice: null,
            retailPriceHistory: [{ price: 'invalid', changedAt: 'invalid-date' }],
          }),
        },
      ],
    });

    const results = await service.getProductsByCompany('co1');
    expect(results).toHaveLength(2);
    expect(results[0].lowestRetailPriceLast30Days).toBe(4.9);
    expect(results[0].discountPrice).toBe(4.6);
    expect(results[1].lowestRetailPriceLast30Days).toBeNull();
    expect(results[1].discountPrice).toBeNull();
  });

  it('converts prices to SEK when country is SE using getRate', async () => {
    (getRate as jest.Mock).mockResolvedValueOnce({ rate: 10 });
    mockDocGet.mockResolvedValueOnce({ data: () => ({ vat: 14 }) });
    mockCollectionGetCampaigns.mockResolvedValueOnce({
      docs: [
        {
          id: 'c1',
          data: () => ({
            company: 'co1',
            code: '',
            start: { toDate: () => new Date('2026-05-01T00:00:00.000Z') },
            end: { toDate: () => new Date('2027-05-01T00:00:00.000Z') },
            discountType: 'fixed',
            products: [{ id: 'p1', discountFixed: 4.6 }],
          }),
        },
      ],
    });
    mockCollectionGetProducts.mockResolvedValueOnce({
      docs: [
        {
          id: 'p1',
          data: () => ({
            id: 'p1',
            company: 'co1',
            showInWebshop: true,
            name: 'Milk',
            amount: 4,
            retailPrice: 5.5,
            unitPrice: 2,
            retailPriceHistory: [{ price: 4.9, changedAt: '2026-05-01T12:00:00.000Z' }],
          }),
        },
      ],
    });

    const results = await service.getProductsByCompany('co1', 'SE');
    expect(getRate).toHaveBeenCalled();
    expect(results[0].retailPrice).toBe(55);
    expect(results[0].discountPrice).toBe(46);
    expect(results[0].unitPrice).toBe(20);
    expect(results[0].lowestRetailPriceLast30Days).toBe(49);
  });

  it('falls back to EUR values when SE rate lookup fails', async () => {
    (getRate as jest.Mock).mockRejectedValueOnce(new Error('rate down'));
    mockDocGet.mockResolvedValueOnce({ data: () => ({ vat: 14 }) });
    mockCollectionGetCampaigns.mockResolvedValueOnce({ docs: [] });
    mockCollectionGetProducts.mockResolvedValueOnce({
      docs: [
        {
          id: 'p1',
          data: () => ({
            id: 'p1',
            company: 'co1',
            showInWebshop: true,
            name: 'Milk',
            amount: 4,
            retailPrice: 5.5,
            unitPrice: 2,
            retailPriceHistory: [{ price: 4.9, changedAt: '2026-05-01T12:00:00.000Z' }],
          }),
        },
      ],
    });

    const results = await service.getProductsByCompany('co1', 'SE');
    expect(results[0].retailPrice).toBe(5.5);
    expect(results[0].unitPrice).toBe(2);
    expect(results[0].lowestRetailPriceLast30Days).toBe(4.9);
  });
});
