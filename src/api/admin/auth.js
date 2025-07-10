// auth.js
import api from "./config";
import { clearAuthData } from "../../utils/auth";

// Login API
export const login = async (phone, password) => {

  try {
    const response = await api.post("/api/admin/adminLogin", {
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    console.log("Haidar")
    throw error.response?.data || error;
  }
};

// Logout API
export const logout = async () => {
  try {
    const response = await api.post("/api/logout");

    // Clear local auth data regardless of API response
    clearAuthData();

    return response.data;
  } catch (error) {
    // Even if logout API fails, clear local data
    clearAuthData();
    throw error.response?.data || error;
  }
};
