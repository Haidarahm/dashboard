import { clearAuthData } from "../../utils/auth";
import api from "./doctorConfig";

// Doctor Login API
export const doctorLogin = async (phone, password) => {
  try {
    const response = await api.post("/api/doctor/doctorLogin", {
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
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
