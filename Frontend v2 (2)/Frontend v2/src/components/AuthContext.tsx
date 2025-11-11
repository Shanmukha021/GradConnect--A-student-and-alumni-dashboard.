import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'student' | 'alumni' | 'recruiter' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Check if this is a demo user
          const demoUser = localStorage.getItem('demoUser');
          if (demoUser && storedToken === 'demo-token') {
            setUser(JSON.parse(demoUser));
            setToken(storedToken);
          } else {
            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            
            // Verify token and get user info
            const response = await axios.get(`${API_BASE_URL}/auth/me`);
            setUser(response.data.data);
            setToken(storedToken);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('demoUser');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // FastAPI expects JSON: { email, password }
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setToken(access_token);

  // Get user info
  const userResponse = await axios.get(`${API_BASE_URL}/auth/me`);
  setUser(userResponse.data.data);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (fullName: string, email: string, password: string, role: string) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        full_name: fullName,
        email,
        password,
        role,
      });

      // After successful registration, log in the user
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demoUser');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};