import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, CurrentUser } from '../types';
import { getCurrentUser, logout as authLogout } from '../services/auth.service';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(() => getCurrentUser());

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  const login = useCallback((currentUser: CurrentUser) => {
    setUser(currentUser);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}