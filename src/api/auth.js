// auth.js
import api from './config';

// Login API
export const login = async (phone, password) => {
  try {
    const response = await api.post('/login', {
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout API
export const logout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
