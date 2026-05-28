import type { EditableCompanyOptions } from '@/services/options';
import type { Options } from '@/types/options';

export interface CompanyOptionsFormValues {
  delivery: string;
  over: string;
  vat: string;
  email: string;
  vismapayApiKey: string;
  vismapayPrivateKey: string;
}

export const emptyCompanyOptionsFormValues: CompanyOptionsFormValues = {
  delivery: '',
  over: '',
  vat: '',
  email: '',
  vismapayApiKey: '',
  vismapayPrivateKey: '',
};

const formatNumber = (value: number | undefined): string => (
  typeof value === 'number' && Number.isFinite(value) ? String(value) : ''
);

const parseNumber = (value: string): number | null => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export function toCompanyOptionsFormValues(options: Options | null): CompanyOptionsFormValues {
  if (!options) {
    return emptyCompanyOptionsFormValues;
  }

  return {
    delivery: formatNumber(options.delivery),
    over: formatNumber(options.over),
    vat: formatNumber(options.vat),
    email: options.email ?? '',
    vismapayApiKey: options.vismapay?.apiKey ?? '',
    vismapayPrivateKey: options.vismapay?.privateKey ?? '',
  };
}

export function validateCompanyOptionsForm(values: CompanyOptionsFormValues): string | null {
  const numericFields: (keyof Pick<CompanyOptionsFormValues, 'delivery' | 'over' | 'vat'>)[] = ['delivery', 'over', 'vat'];

  for (const field of numericFields) {
    if (parseNumber(values[field]) == null) {
      return `companyOptions.validation.${field}`;
    }
  }

  return null;
}

export function buildCompanyOptionsPayload(values: CompanyOptionsFormValues): EditableCompanyOptions {
  const delivery = parseNumber(values.delivery);
  const over = parseNumber(values.over);
  const vat = parseNumber(values.vat);

  if (delivery == null || over == null || vat == null) {
    throw new Error('Company options contain invalid numeric values');
  }

  return {
    delivery,
    over,
    vat,
    email: values.email.trim(),
    vismapay: {
      apiKey: values.vismapayApiKey.trim(),
      privateKey: values.vismapayPrivateKey.trim(),
    },
  };
}
