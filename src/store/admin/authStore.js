import { create } from "zustand";
import { login, logout } from "../../api/admin/auth";
import {
  isAuthenticated,
  getCurrentUser,
  clearAuthData,
  storeAuthData,
  isTokenValid,
} from "../../utils/auth";
import { toast } from "react-toastify";

export const useAuthStore = create((set, get) => ({
  user: getCurrentUser(),
  token: null,
  loading: false,
  error: null,
  isAuthenticated: isAuthenticated(),

  login: async (phone, password, rememberMe = false) => {
    set({ loading: true, error: null });
    try {
      const data = await login(phone, password);
      if (data && data.token && data.user) {
        storeAuthData(data.token, data.user, rememberMe, data.user.role,data.user.first_name);
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          role: data.user.role,
        });
        window.location.href = "/";

        toast.success("Login successful");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      set({ error: error.message || "Login failed" });
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await logout();
      clearAuthData();
      set({ user: null, token: null, isAuthenticated: false });
      toast.success("Logged out successfully");
    } catch (error) {
      clearAuthData();
      set({ user: null, token: null, isAuthenticated: false });
      toast.error(error.message || "Logout failed");
    } finally {
      set({ loading: false });
    }
  },

  checkAuth: () => {
    const valid = isAuthenticated() && isTokenValid();
    set({ isAuthenticated: valid, user: valid ? getCurrentUser() : null });
    return valid;
  },

  getCurrentUser: () => {
    const user = getCurrentUser();
    set({ user });
    return user;
  },

  clearAuth: () => {
    clearAuthData();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
