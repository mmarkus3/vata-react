import { Test, TestingModule } from '@nestjs/testing';
import { firestore } from 'firebase-admin';
import { ProductsService } from './products.service';

jest.mock('firebase-admin', () => ({
  firestore: jest.fn(),
}));

describe('ProductsService', () => {
  let service: ProductsService;
  const mockDocGet = jest.fn();
  const mockCollectionGet = jest.fn();
  const mockCollectionWhere = jest.fn(() => ({ get: mockCollectionGet }));
  const mockCollection = jest.fn(() => ({ where: mockCollectionWhere }));
  const mockDoc = jest.fn(() => ({ get: mockDocGet }));

  beforeEach(async () => {
    jest.clearAllMocks();
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

    const result = await service.getProductByIdAndCompany('co1', 'p1');
    expect(result.lowestRetailPriceLast30Days).toBe(6.9);
  });

  it('includes lowestRetailPriceLast30Days in list response and keeps null fallback', async () => {
    mockDocGet.mockResolvedValueOnce({ data: () => ({ vat: 14 }) });
    mockCollectionGet.mockResolvedValueOnce({
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
    expect(results[1].lowestRetailPriceLast30Days).toBeNull();
  });
});
