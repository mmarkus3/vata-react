import {
  getCustomerAddressLine,
  getCustomerFullName,
  hasOrderCustomer,
} from '@/app/order/orderDetailCustomerState';

describe('orderDetailCustomerState', () => {
  it('returns true when customer has at least one populated field', () => {
    expect(
      hasOrderCustomer({
        firstname: '',
        lastname: '',
        email: 'customer@example.com',
        address_street: '',
        address_city: '',
        address_zip: '',
      }),
    ).toBe(true);
  });

  it('returns false when customer is missing or all fields are empty', () => {
    expect(hasOrderCustomer(undefined)).toBe(false);
    expect(hasOrderCustomer(null)).toBe(false);
    expect(
      hasOrderCustomer({
        firstname: '   ',
        lastname: '',
        email: '',
        address_street: '',
        address_city: '',
        address_zip: '',
      }),
    ).toBe(false);
  });

  it('builds full name and address line from customer data', () => {
    const customer = {
      firstname: 'Ada',
      lastname: 'Lovelace',
      email: 'ada@example.com',
      address_street: 'Analytical Engine St 1',
      address_city: 'London',
      address_zip: '10001',
    };

    expect(getCustomerFullName(customer)).toBe('Ada Lovelace');
    expect(getCustomerAddressLine(customer)).toBe('Analytical Engine St 1, 10001 London');
  });

  it('returns null display fields when customer data is empty', () => {
    const customer = {
      firstname: '',
      lastname: ' ',
      email: '',
      address_street: '',
      address_city: '',
      address_zip: '',
    };

    expect(getCustomerFullName(customer)).toBeNull();
    expect(getCustomerAddressLine(customer)).toBeNull();
  });
});
