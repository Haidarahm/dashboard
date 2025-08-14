import api from "../../config/config";
import { clearAuthData } from "../../utils/auth";

// Secretary Login API
export const login = async (phone, password) => {
  try {
    const response = await api.post("/api/secretary/secretaryLogin", {
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Secretary Logout API
export const logout = async () => {
  try {
    const response = await api.post("/api/secretary/secretaryLogout");
    // Clear authentication data after successful logout
    clearAuthData();
    return response.data;
  } catch (error) {
    // Even if logout fails, clear local auth data
    clearAuthData();
    throw error.response?.data || error;
  }
};
