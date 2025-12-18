import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
}
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  signup: (name: string, email: string) => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // Check localStorage on mount
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);
  const login = (email: string, name: string = 'User') => {
    const isAdmin = email === 'admin@fireguard.com';
    const role = isAdmin ? 'admin' : 'user';
    const userData: User = {
      email,
      name: isAdmin ? 'Administrator' : name,
      role
    };
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };
  const signup = async (name: string, email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Signup doesn't auto-login, just returns success
    return;
  };
  return <AuthContext.Provider value={{
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    signup
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}