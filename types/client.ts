export interface Client {
  id?: string;
  name: string;
  company: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  phone: string;
  email: string;
}
