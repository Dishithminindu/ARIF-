import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SafeUser } from '../types/api';
import { api } from '../services/api';

interface AuthContextType {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot' | 'reset';
  resetTokenForModal: string;
  openAuthModal: (tab?: 'login' | 'register' | 'forgot' | 'reset', resetToken?: string) => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string, remember?: boolean) => Promise<{ success: boolean; message: string; user: SafeUser }>;
  register: (data: {
    full_name: string;
    student_id: string;
    email: string;
    password: string;
    confirm_password: string;
    department: string;
    course: string;
    contact_number?: string;
  }) => Promise<{ success: boolean; message: string; user: SafeUser }>;
  logout: () => Promise<void>;
  updateProfile: (data: { full_name?: string; contact_number?: string; department?: string; course?: string }) => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [resetTokenForModal, setResetTokenForModal] = useState<string>('');

  const refreshMe = async () => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      localStorage.removeItem('arif_auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if reset token exists in URL params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetTokenForModal(token);
      setAuthModalTab('reset');
      setAuthModalOpen(true);
    }

    refreshMe();
  }, []);

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' | 'reset' = 'login', resetToken: string = '') => {
    setAuthModalTab(tab);
    if (resetToken) {
      setResetTokenForModal(resetToken);
    }
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (identifier: string, password: string, remember: boolean = false) => {
    const res = await api.auth.login({ identifier, password, remember });
    if (res.success && res.user) {
      setUser(res.user);
      if (res.token) {
        localStorage.setItem('arif_auth_token', res.token);
      }
      setAuthModalOpen(false);
      return res;
    }
    throw new Error(res.message || 'Login failed.');
  };

  const register = async (data: {
    full_name: string;
    student_id: string;
    email: string;
    password: string;
    confirm_password: string;
    department: string;
    course: string;
    contact_number?: string;
  }) => {
    const res = await api.auth.register(data);
    if (res.success && res.user) {
      setUser(res.user);
      if (res.token) {
        localStorage.setItem('arif_auth_token', res.token);
      }
      setAuthModalOpen(false);
      return res;
    }
    throw new Error(res.message || 'Registration failed.');
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      localStorage.removeItem('arif_auth_token');
    }
  };

  const updateProfile = async (data: { full_name?: string; contact_number?: string; department?: string; course?: string }) => {
    const res = await api.auth.updateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    isLoading,
    authModalOpen,
    authModalTab,
    resetTokenForModal,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    updateProfile,
    refreshMe
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
