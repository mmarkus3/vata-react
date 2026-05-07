import { createCompany as createCompanyService, getCompanyById } from '@/services/company';
import { auth } from '@/services/firebase';
import { getItem, saveAsItem, updateItem } from '@/services/firestore';
import { acceptInvite, getInviteByEmail } from '@/services/invite';
import type { AuthContextType, AuthUser } from '@/types/auth';
import { Company } from '@/types/company';
import { User } from '@/types/user';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import React, { createContext, FC, ReactNode, useEffect, useState } from 'react';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);

  const createUserDocument = async (uid: string, email: string | null, displayName: string | null) => {
    try {
      await saveAsItem('users', uid, {
        email,
        displayName,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to create user document:', err);
    }
  };

  const fetchUserProfile = async (uid: string): Promise<User | null> => {
    try {
      return await getItem<User>('users', uid);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  };

  const checkInviteAndCompany = async (userEmail: string, uid: string): Promise<User> => {
    const profile = await fetchUserProfile(uid);

    // If user already has a company, return the profile
    if (profile?.company) {
      return profile;
    }

    // Check for pending invite
    const invite = await getInviteByEmail(userEmail);
    if (invite) {
      // Accept the invite and update user profile
      await acceptInvite(invite.id!);
      const updatedProfile: User = {
        ...profile,
        email: userEmail,
        company: invite.company,
      };
      await saveAsItem('users', uid, updatedProfile);
      return updatedProfile;
    }

    // No invite found, show create company modal
    setShowCreateCompanyModal(true);

    // Return profile without company (modal will handle creation)
    return profile || { email: userEmail };
  };

  // Subscribe to auth state changes
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) {
        return;
      }

      if (currentUser) {
        setIsLoading(true);
        const profile = await checkInviteAndCompany(currentUser.email!, currentUser.uid);

        if (!isMounted) {
          return;
        }

        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          profile,
        });
        const company = profile?.company ? await getCompanyById(profile.company) : null;
        setCompany(company);
      } else {
        setUser(null);
        setCompany(null);
        setShowCreateCompanyModal(false);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = userCredential.user;

      await createUserDocument(createdUser.uid, createdUser.email, createdUser.displayName);

      // Don't set profile here - it will be fetched from Firestore in the auth state listener
      setUser({
        uid: createdUser.uid,
        email: createdUser.email,
        displayName: createdUser.displayName,
        profile: null, // Will be set by the auth state listener
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // Profile will be set by the auth state listener
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kirjautuminen epäonnistui';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Salasanan palautus epäonnistui';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
      setCompany(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Rekisteröityminen epäonnistui';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const createCompany = async (name: string): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      setIsLoading(true);

      const companyId = await createCompanyService(name, user.uid);
      const updatedProfile: User = {
        ...user.profile,
        email: user.email!,
        company: companyId,
      };

      await updateItem('users', user.uid, updatedProfile);

      setUser({
        ...user,
        profile: updatedProfile,
      });
      const company = companyId ? await getCompanyById(companyId) : null;
      setCompany(company);

      setShowCreateCompanyModal(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create company';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeCreateCompanyModal = () => {
    setShowCreateCompanyModal(false);
  };

  const value: AuthContextType = {
    user,
    company,
    isLoading,
    error,
    showCreateCompanyModal,
    signUp,
    signIn,
    forgotPassword,
    signOut,
    createCompany,
    closeCreateCompanyModal,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
};
