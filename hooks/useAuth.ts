import { AuthContext } from '@/components/providers/AuthProvider';
import { useContext } from 'react';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
