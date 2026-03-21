import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const validateToken = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const res = await api.get('/api/auth/validate');
        if (res.data.valid) {
          setUser({
            id: res.data.userId,
            username: res.data.username,
            email: res.data.email,
            phoneNumber: res.data.phoneNumber
          });
          setToken(storedToken);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      }
    }
    setLoading(false);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    validateToken();
  }, []);

  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Validate to get user info
    try {
      const res = await api.get('/api/auth/validate', {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      if (res.data.valid) {
        setUser({
          id: res.data.userId,
          username: res.data.username,
          email: res.data.email,
          phoneNumber: res.data.phoneNumber
        });
      }
    } catch {
      clearAuth();
    }
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
