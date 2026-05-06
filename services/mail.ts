import { Mail } from '@/types/mail';
import { saveItem } from './firestore';

export async function createMail(data: Mail): Promise<string> {
  try {
    return saveItem('mail', data)
  } catch (error) {
    console.error('Failed to create mail:', error);
    throw error;
  }
}