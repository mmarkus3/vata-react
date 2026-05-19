import type { OrderCustomer } from '@/types/order';

export const hasOrderCustomer = (customer: OrderCustomer | null | undefined): boolean => {
  if (!customer) return false;

  const fields = [
    customer.firstname,
    customer.lastname,
    customer.email,
    customer.phone,
    customer.address_street,
    customer.address_city,
    customer.address_zip,
  ];

  return fields.some((value) => typeof value === 'string' && value.trim().length > 0);
};

export const getCustomerFullName = (customer: OrderCustomer | null | undefined): string | null => {
  if (!customer) return null;

  const firstName = customer.firstname?.trim() ?? '';
  const lastName = customer.lastname?.trim() ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName.length > 0 ? fullName : null;
};

export const getCustomerAddressLine = (customer: OrderCustomer | null | undefined): string | null => {
  if (!customer) return null;

  const street = customer.address_street?.trim() ?? '';
  const zip = customer.address_zip?.trim() ?? '';
  const city = customer.address_city?.trim() ?? '';

  const cityLine = [zip, city].filter(Boolean).join(' ');
  const parts = [street, cityLine].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : null;
};
