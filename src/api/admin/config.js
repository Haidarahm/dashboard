// src/api/axiosConfig.js
import axios from "axios";
import { toast } from "react-toastify";
// Function to clear authentication data and redirect to login
const clearAuthAndRedirect = () => {
  // Clear all authentication related data from both storages
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("user");

  // Show notification
  toast.error("Session expired. Please login again.");

  // Redirect to login page
  window.location.href = "/login";
};

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,

  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning":true,
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    // Check localStorage first, then sessionStorage
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response) {
      const { status } = error.response;

      // Token expired or invalid
      if (status === 401) {
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes("/login")) {
          clearAuthAndRedirect();
        }
      }

      // Forbidden - user doesn't have permission
      if (status === 403) {
        toast.error("You do not have permission to access this resource.");
      }

      // Server error
      if (status >= 500) {
        toast.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
