// Authentication utility functions
import { toast } from "react-toastify";

/**
 * Get storage type based on remember me preference
 * @returns {Storage} - localStorage or sessionStorage
 */
const getStorage = () => {
  // Check if user has data in localStorage (remember me was checked)
  const localAuthToken = localStorage.getItem("authToken");
  if (localAuthToken) {
    return localStorage;
  }
  // Otherwise use sessionStorage
  return sessionStorage;
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid tokens
 */
export const isAuthenticated = () => {
  // Check both localStorage and sessionStorage
  const localAuthToken = localStorage.getItem("authToken");
  const localToken = localStorage.getItem("token");
  const sessionAuthToken = sessionStorage.getItem("authToken");
  const sessionToken = sessionStorage.getItem("token");

  return !!(
    (localAuthToken && localToken) ||
    (sessionAuthToken && sessionToken)
  );
};

/**
 * Get current user data from storage
 * @returns {object|null} - User object or null if not found
 */
export const getCurrentUser = () => {
  try {
    const storage = getStorage();
    const userStr = storage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Clear all authentication data from both localStorage and sessionStorage
 */
export const clearAuthData = () => {
  // Clear from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("role")
  sessionStorage.removeItem("role")
  // Clear from sessionStorage
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("user");
};

/**
 * Logout user and redirect to login page
 * @param {boolean} showMessage - Whether to show logout message
 */
export const logoutUser = (showMessage = true) => {
  clearAuthData();

  if (showMessage) {
    toast.success("Logged out successfully");
  }

  // Use window.location for full page reload to clear any app state
  window.location.href = "/login";
};

/**
 * Handle session expiration
 */
export const handleSessionExpired = () => {
  clearAuthData();
  toast.error("Session expired. Please login again.");
  window.location.href = "/login";
};

/**
 * Store authentication data
 * @param {string} token - JWT token
 * @param {object} user - User data object
 * @param {boolean} rememberMe - Whether to store in localStorage (true) or sessionStorage (false)
 */
export const storeAuthData = (token, user = null, rememberMe = false,role,name) => {
  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem("authToken", token);
  storage.setItem("token", token);
  storage.setItem("role", role);
  storage.setItem("name", name);

  if (user) {
    storage.setItem("user", JSON.stringify(user));
  }
};

/**
 * Check if token exists and is not expired (basic check)
 * Note: This is a basic check. For production, you might want to validate JWT expiration
 * @returns {boolean} - True if token appears valid
 */
export const isTokenValid = () => {
  const storage = getStorage();
  const token = storage.getItem("token");

  if (!token) {
    return false;
  }

  try {
    // Basic JWT structure check (header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    // Decode payload to check expiration (if present)
    const payload = JSON.parse(atob(parts[1]));

    // Check if token has expiration and if it's expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};