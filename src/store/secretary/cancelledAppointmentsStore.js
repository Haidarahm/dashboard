import { create } from "zustand";
import { showCancelledAppointments } from "../../api/secretary/cancelledAppointments";
import { toast } from "react-toastify";

const useCancelledAppointmentsStore = create((set, get) => ({
  // State
  cancelledAppointments: [],
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  },

  // Actions
  fetchCancelledAppointments: async (page = 1, perPage = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await showCancelledAppointments(page, perPage);
      set({
        cancelledAppointments: response.data || [],
        pagination: response.meta || {
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: 10,
        },
        loading: false,
      });
      return response;
    } catch (err) {
      const errorMessage = err?.message || err.toString();
      set({ error: errorMessage, loading: false });
      toast.error("Failed to fetch cancelled appointments");
      return null;
    }
  },

  // Utility setters/clearers
  setCurrentPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, current_page: page },
    })),

  clearError: () => set({ error: null }),
  resetState: () =>
    set({
      cancelledAppointments: [],
      loading: false,
      error: null,
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
      },
    }),
}));

export default useCancelledAppointmentsStore;
