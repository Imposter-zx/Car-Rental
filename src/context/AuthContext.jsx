import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isDemo = localStorage.getItem('isDemo') === 'true';
    if (token) {
      setUser({ token, isDemo });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    if (email === 'admin@gamilrent.com' && password === 'admin123') {
      const demoToken = 'demo-jwt-token-' + Date.now();
      localStorage.setItem('token', demoToken);
      localStorage.setItem('isDemo', 'true');
      setUser({ token: demoToken, isDemo: true });
      return { success: true };
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setUser({ token });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Secondary fallback: If the API is completely unreachable (e.g. on Vercel without backend)
      // but credentials are provided, we can still allow entry for testing if desired.
      // For now, we'll keep it strictly to the demo credentials above.
      
      return {
        success: false,
        error: error.code === 'ERR_NETWORK' 
          ? 'Backend unreachable. Please use demo credentials for testing.' 
          : (error.response?.data?.message || 'Login failed'),
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isDemo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
