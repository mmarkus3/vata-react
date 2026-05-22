import { getPaidOrderNotificationBody, getSentOrderBody } from '@/functions/src/on-item/mail';

describe('getSentOrderBody', () => {
  it('includes order id, customer info, and product lines', () => {
    const body = getSentOrderBody('order-42', {
      company: 'c1',
      created: {} as any,
      status: 'paid',
      country: 'FI',
      customer: {
        firstname: 'Ada',
        lastname: 'Lovelace',
        email: 'ada@example.com',
        phone: '12345',
        address_street: 'Main street 1',
        address_zip: '00100',
        address_city: 'Helsinki',
      },
      products: [
        { id: 'p1', name: 'Milk', amount: 2 },
        { id: 'p2', name: 'Bread', amount: 1 },
      ],
    });

    expect(body).toContain('order-42');
    expect(body).toContain('Ada Lovelace');
    expect(body).toContain('Milk');
    expect(body).toContain('Bread');
    expect(body).toContain('2');
    expect(body).toContain('1');
  });
});

describe('getPaidOrderNotificationBody', () => {
  it('includes title context, order id, and product lines', () => {
    const body = getPaidOrderNotificationBody('order-99', {
      company: 'c1',
      created: {} as any,
      status: 'paid',
      country: 'FI',
      products: [
        { id: 'p1', name: 'Cheese', amount: 3 },
        { id: 'p2', name: 'Juice', amount: 2 },
      ],
    });

    expect(body).toContain('order-99');
    expect(body).toContain('Cheese');
    expect(body).toContain('Juice');
    expect(body).toContain('3');
    expect(body).toContain('2');
  });
});
