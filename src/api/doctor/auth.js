/* eslint-disable no-useless-catch */
import { clearAuthData } from "../../utils/auth";
import api from "../../config/config";

export const doctorLogin = async (phone, password) => {
  try {
    const response = await api.post("/api/doctor/doctorLogin", {
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Doctor Logout API
export const doctorLogout = async () => {
  try {
    const response = await api.post("/api/doctor/doctorLogout");
    clearAuthData();
    return response.data;
  } catch (error) {
    clearAuthData();
    throw error.response?.data || error;
  }
};
