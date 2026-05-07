import { Company } from './company';
import { User } from './user';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  profile?: User | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  showCreateCompanyModal: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  createCompany: (name: string) => Promise<void>;
  closeCreateCompanyModal: () => void;
}
