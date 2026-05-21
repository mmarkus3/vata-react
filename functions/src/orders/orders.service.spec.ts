/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { firestore } from 'firebase-admin';
import { getRate } from '../currency/currency';
import { OrdersService } from './orders.service';

const mockCreateCharge = jest.fn().mockResolvedValue({ token: 'charge-token' });
const mockSetPrivateKey = jest.fn();
const mockSetApiKey = jest.fn();

jest.mock('visma-pay', () => ({
  __esModule: true,
  default: {
    createCharge: (...args: any[]) => mockCreateCharge(...args),
    setPrivateKey: (...args: any[]) => mockSetPrivateKey(...args),
    setApiKey: (...args: any[]) => mockSetApiKey(...args),
    getMerchantPaymentMethods: jest.fn(),
  },
}));

jest.mock('firebase-admin', () => ({
  firestore: jest.fn(),
}));
jest.mock('../currency/currency', () => ({
  getRate: jest.fn(),
}));

describe('OrdersService', () => {
  let service: OrdersService;
  const mockDocGet = jest.fn();
  const mockDocSet = jest.fn().mockResolvedValue({ writeTime: 'now' });
  const mockDoc = jest.fn(() => ({ get: mockDocGet, set: mockDocSet }));

  const mockCampaignGet = jest.fn();
  const mockProductsGet = jest.fn();
  const makeQuery = (getFn: jest.Mock) => ({
    where: jest.fn(() => makeQuery(getFn)),
    get: getFn,
  });
  const mockCollection = jest.fn((name: string) => makeQuery(name === 'campaigns' ? mockCampaignGet : mockProductsGet));

  beforeEach(async () => {
    jest.clearAllMocks();
    (getRate as jest.Mock).mockResolvedValue({ rate: 10 });
    (firestore as unknown as jest.Mock).mockReturnValue({
      doc: mockDoc,
      collection: mockCollection,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns EUR prices by default from getPrices', async () => {
    mockDocGet.mockResolvedValueOnce({ data: () => ({ over: 100, delivery: 10 }) });
    const result = await service.getPrices('co1');
    expect(result).toEqual({ over: 100, delivery: 10 });
    expect(getRate).not.toHaveBeenCalled();
  });

  it('converts getPrices values to SEK when country is SE', async () => {
    (getRate as jest.Mock).mockResolvedValueOnce({ rate: 11 });
    mockDocGet.mockResolvedValueOnce({ data: () => ({ over: 100, delivery: 10 }) });
    const result = await service.getPrices('co1', 'SE');
    expect(getRate).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ over: 1100, delivery: 110 });
  });

  it('falls back to EUR prices when SE conversion rate fails', async () => {
    (getRate as jest.Mock).mockRejectedValueOnce(new Error('rate unavailable'));
    mockDocGet.mockResolvedValueOnce({ data: () => ({ over: 100, delivery: 10 }) });
    const result = await service.getPrices('co1', 'SE');
    expect(result).toEqual({ over: 100, delivery: 10 });
  });

  it('rejects placeOrder when referenced product does not exist', async () => {
    mockDocGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({
          id: 'o1',
          company: 'co1',
          status: 'pending',
          products: [{ id: 'p1', amount: 2, name: 'Milk' }],
        }),
      })
      .mockResolvedValueOnce({ data: () => ({ vat: 0.14, over: 100, delivery: 10 }) })
      .mockResolvedValueOnce({
        exists: false,
        data: () => undefined,
      });

    const order1 = { id: 'o1' } as Record<string, unknown>;
    await expect(service.placeOrder('co1', order1)).rejects.toThrow(BadRequestException);
    expect(mockDocSet).not.toHaveBeenCalled();
  });

  it('rejects placeOrder when stock is insufficient', async () => {
    mockDocGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({
          id: 'o1',
          company: 'co1',
          status: 'pending',
          products: [{ id: 'p1', amount: 5, name: 'Milk' }],
        }),
      })
      .mockResolvedValueOnce({ data: () => ({ vat: 0.14, over: 100, delivery: 10 }) })
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ id: 'p1', amount: 3, retailPrice: 10 }),
      });

    const order2 = { id: 'o1' } as Record<string, unknown>;
    await expect(service.placeOrder('co1', order2)).rejects.toThrow(BadRequestException);
    expect(mockDocSet).not.toHaveBeenCalled();
  });

  it('applies fixed campaign code discount to matching product finalPrice', async () => {
    mockDocGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({
          id: 'o1',
          company: 'co1',
          status: 'pending',
          discount: 'SAVE',
          paymentMethod: 'fi_nordea',
          returnUrl: 'https://example.com/return',
          customer: { email: 'buyer@example.com' },
          products: [{ id: 'p1', amount: 1, name: 'Milk' }],
        }),
      })
      .mockResolvedValueOnce({ data: () => ({ vat: 0.14, over: 100, delivery: 10, vismapay: {} }) })
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ id: 'p1', name: 'Milk', amount: 4, retailPrice: 12 }),
      });

    mockCampaignGet.mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            code: 'SAVE',
            start: '2026-01-01T00:00:00.000Z',
            end: '2027-01-01T00:00:00.000Z',
            discountType: 'fixed',
            products: [{ id: 'p1', discountFixed: 9.5 }],
          }),
        },
      ],
    });

    const result = await service.placeOrder('co1', {
      id: 'o1',
      customer: { email: 'buyer@example.com' },
      paymentMethod: 'fi_nordea',
      returnUrl: 'https://example.com/return',
      deliveryMethod: 'pickup',
    } as any);

    expect(result.products[0].finalPrice).toBe(9.5);
    expect(result.amount).toBe(9.5);
    expect(mockDocSet).toHaveBeenCalledTimes(1);
  });

  it('applies percentage campaign code discount using retailPrice', async () => {
    mockDocGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({
          id: 'o1',
          company: 'co1',
          status: 'pending',
          discount: 'SAVE20',
          paymentMethod: 'fi_nordea',
          returnUrl: 'https://example.com/return',
          customer: { email: 'buyer@example.com' },
          products: [{ id: 'p1', amount: 1, name: 'Milk' }],
        }),
      })
      .mockResolvedValueOnce({ data: () => ({ vat: 0.14, over: 100, delivery: 10, vismapay: {} }) })
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ id: 'p1', name: 'Milk', amount: 4, retailPrice: 10 }),
      });

    mockCampaignGet.mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            code: 'SAVE20',
            start: '2026-01-01T00:00:00.000Z',
            end: '2027-01-01T00:00:00.000Z',
            discountType: 'percentage',
            products: [{ id: 'p1', discountPercentage: 20 }],
          }),
        },
      ],
    });

    const result = await service.placeOrder('co1', {
      id: 'o1',
      customer: { email: 'buyer@example.com' },
      paymentMethod: 'fi_nordea',
      returnUrl: 'https://example.com/return',
      deliveryMethod: 'pickup',
    } as any);
    expect(result.products[0].finalPrice).toBe(8);
    expect(result.amount).toBe(8);
  });

  it('keeps non-discounted finalPrice when campaign is invalid/inactive or product not listed', async () => {
    mockDocGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({
          id: 'o1',
          company: 'co1',
          status: 'pending',
          discount: 'SAVE',
          paymentMethod: 'fi_nordea',
          returnUrl: 'https://example.com/return',
          customer: { email: 'buyer@example.com' },
          products: [{ id: 'p1', amount: 1, name: 'Milk' }],
        }),
      })
      .mockResolvedValueOnce({ data: () => ({ vat: 0.14, over: 100, delivery: 10, vismapay: {} }) })
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ id: 'p1', name: 'Milk', amount: 4, retailPrice: 10 }),
      });

    mockCampaignGet.mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            code: 'SAVE',
            start: '2020-01-01T00:00:00.000Z',
            end: '2020-02-01T00:00:00.000Z',
            discountType: 'fixed',
            products: [{ id: 'other', discountFixed: 1 }],
          }),
        },
      ],
    });

    const result = await service.placeOrder('co1', {
      id: 'o1',
      customer: { email: 'buyer@example.com' },
      paymentMethod: 'fi_nordea',
      returnUrl: 'https://example.com/return',
      deliveryMethod: 'pickup',
    } as any);
    expect(result.products[0].finalPrice).toBe(10);
    expect(result.amount).toBe(10);
  });
});
