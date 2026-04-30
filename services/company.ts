import { Company } from '@/types/company';
import { getItem, saveItem } from './firestore';

export async function createCompany(name: string, createdBy: string): Promise<string> {
  try {
    return saveItem('companies', { name, createdBy })
  } catch (error) {
    console.error('Failed to create company:', error);
    throw error;
  }
}

export async function getCompanyById(companyId: string): Promise<Company | null> {
  try {
    return await getItem<Company>('companies', companyId);
  } catch (error) {
    console.error('Failed to fetch company:', error);
    throw new Error(error instanceof Error ? error.message : 'Yrityksen haku epäonnistui');
  }
}