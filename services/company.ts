import { saveItem } from './firestore';

export async function createCompany(name: string, createdBy: string): Promise<string> {
  try {
    return saveItem('companies', { name, createdBy })
  } catch (error) {
    console.error('Failed to create company:', error);
    throw error;
  }
}