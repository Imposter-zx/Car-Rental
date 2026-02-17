import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const isDemo = localStorage.getItem('isDemo') === 'true';
      if (token && !isDemo) {
        try {
          const response = await api.get('/auth/me');
          setUser({ ...response.data, token });
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
        }
      } else if (token && isDemo) {
        setUser({ token, isDemo, email: 'admin@gamil.ma', name: 'Admin Gamil' });
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    // Demo credentials fallback (matching seed)
    if (email === 'admin@gamil.ma' && password === 'admin123') {
      const demoToken = 'demo-jwt-token-' + Date.now();
      localStorage.setItem('token', demoToken);
      localStorage.setItem('isDemo', 'true');
      setUser({ token: demoToken, isDemo: true, email: 'admin@gamil.ma', name: 'Admin Gamil' });
      return { success: true };
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('isDemo', 'false');
      setUser({ ...userData, token });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
        errorData: error.response?.data
      };
    }
  };

  const updateProfile = async (data) => {
    const response = await api.put('/auth/profile', data);
    setUser(prev => ({ ...prev, ...response.data }));
    return response.data;
  };

  const updatePassword = async (data) => {
    const response = await api.put('/auth/password', data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isDemo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, updatePassword, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
