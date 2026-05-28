import { firestore } from '@/services/firebase';
import type { Options } from '@/types/options';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type EditableCompanyOptions = Omit<Options, 'currencyRate'>;

const OPTIONS_COLLECTION = 'options';

export function stripUndefinedFields<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedFields(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, item]) => {
      if (item !== undefined) {
        acc[key] = stripUndefinedFields(item);
      }

      return acc;
    }, {}) as T;
  }

  return value;
}

export async function getCompanyOptions(companyId: string): Promise<Options | null> {
  if (!companyId.trim()) {
    throw new Error('Company ID is required');
  }

  const snapshot = await getDoc(doc(firestore, OPTIONS_COLLECTION, companyId));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as Options;
}

export async function updateCompanyOptions(companyId: string, options: Partial<EditableCompanyOptions>): Promise<void> {
  if (!companyId.trim()) {
    throw new Error('Company ID is required');
  }

  const editableOptions = { ...(options as Partial<Options>) };
  delete editableOptions.currencyRate;
  const payload = stripUndefinedFields(editableOptions);
  await setDoc(doc(firestore, OPTIONS_COLLECTION, companyId), payload, { merge: true });
}
