import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const carService = {
  getAll: () => api.get('/cars'),
  create: (data) => api.post('/cars', data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  updateStatus: (id, status) => api.patch(`/bookings/${id}`, { status }),
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => localStorage.removeItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default api;
