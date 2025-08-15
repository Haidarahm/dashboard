import { create } from "zustand";
import { login, logout } from "../../api/secretary/auth";
import { storeAuthData, clearAuthData } from "../../utils/auth";
import { toast } from "react-toastify";

const useSecretaryAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Actions
  loginAction: async (phone, password, rememberMe = false) => {
    set({ loading: true, error: null });
    try {
      const response = await login(phone, password);

      // Store user data and token
      const userData = response.user || response;
      const token = response.token || response.access_token;

      // Store auth data using utility function (includes role)
      storeAuthData(
        token,
        userData,
        rememberMe,
        "secretary",
        userData?.name || userData?.first_name
      );

      set({
        user: userData,
        token,
        isAuthenticated: true,
        loading: false,
      });

      toast.success("Login successful");
      window.location.href = "/";

      return response;
    } catch (err) {
      const errorMsg = err?.message || err.toString();
      set({
        error: errorMsg,
        loading: false,
        isAuthenticated: false,
      });
      toast.error(errorMsg || "Login failed");
      return null;
    }
  },

  logoutAction: async () => {
    set({ loading: true, error: null });
    try {
      await logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
      toast.success("Logged out successfully");
      return true;
    } catch (err) {
      // Even if logout fails, clear local state
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
      const errorMsg = err?.message || err.toString();
      set({ error: errorMsg });
      toast.error(errorMsg || "Logout failed");
      return false;
    }
  },

  // Initialize auth state from storage
  initializeAuth: () => {
    try {
      let token = localStorage.getItem("token");
      let user = localStorage.getItem("user");

      if (!token) {
        token = sessionStorage.getItem("token");
        user = sessionStorage.getItem("user");
      }

      if (token && user) {
        const userData = JSON.parse(user);
        set({
          user: userData,
          token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      // Clear corrupted data
      clearAuthData();
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Set user data
  setUser: (user) => set({ user }),

  // Set token
  setToken: (token) => set({ token }),

  // Reset auth state
  resetAuth: () => {
    clearAuthData();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  },
}));

export default useSecretaryAuthStore;
