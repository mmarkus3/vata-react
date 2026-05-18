import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { OrdersService } from './orders.service';

jest.mock('firebase-admin', () => ({
  firestore: jest.fn(),
}));

describe('OrdersService', () => {
  let service: OrdersService;
  const mockDocGet = jest.fn();
  const mockDocSet = jest.fn();
  const mockDoc = jest.fn(() => ({ get: mockDocGet, set: mockDocSet }));

  beforeEach(async () => {
    jest.clearAllMocks();
    (firestore as unknown as jest.Mock).mockReturnValue({
      doc: mockDoc,
      collection: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      .mockResolvedValueOnce({
        exists: false,
        data: () => undefined,
      });

    await expect(service.placeOrder('co1', { id: 'o1' } as any)).rejects.toThrow(BadRequestException);
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
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ amount: 3 }),
      });

    await expect(service.placeOrder('co1', { id: 'o1' } as any)).rejects.toThrow(BadRequestException);
    expect(mockDocSet).not.toHaveBeenCalled();
  });

  it('places order when all products exist and stock is sufficient', async () => {
    mockDocGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({
          id: 'o1',
          company: 'co1',
          status: 'pending',
          products: [
            { id: 'p1', amount: 2, name: 'Milk' },
            { id: 'p2', amount: 1, name: 'Bread' },
          ],
        }),
      })
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ amount: 10 }),
      })
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ amount: 2 }),
      });

    const result = await service.placeOrder('co1', { id: 'o1' } as any);

    expect(result.status).toBe('placed');
    expect(mockDocSet).toHaveBeenCalledTimes(1);
  });
});
