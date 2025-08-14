import { create } from "zustand";
import { login, logout } from "../../api/secretary/auth";

const useSecretaryAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Actions
  loginAction: async (phone, password) => {
    set({ loading: true, error: null });
    try {
      const response = await login(phone, password);

      // Store user data and token
      const userData = response.user || response;
      const token = response.token || response.access_token;

      // Save to localStorage and sessionStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));

      set({
        user: userData,
        token,
        isAuthenticated: true,
        loading: false,
      });

      return response;
    } catch (err) {
      const errorMsg = err?.message || err.toString();
      set({
        error: errorMsg,
        loading: false,
        isAuthenticated: false,
      });
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
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
