import { create } from "zustand";
import {
  showAllAppointmentsByDate,
  showAppointmentsByStatus,
  showAppointmentsByType,
  cancelAppointment,
  cancelAppointments, // <-- import new API
  showAppointmentResults,
} from "../../api/doctor/appointments";

export const useAppointmentsStore = create((set) => ({
  allAppointments: [],
  filteredAppointments: [],
  loading: false,
  error: null,
  currentMonthYear: null,

  fetchAllByDate: async (monthYear) => {
    set({ loading: true, error: null });
    try {
      const data = await showAllAppointmentsByDate(monthYear);
      set({
        allAppointments: data,
        currentMonthYear: monthYear,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch appointments",
        loading: false,
      });
    }
  },

  fetchByStatus: async (status, date) => {
    const state = useAppointmentsStore.getState();
    if (!state.currentMonthYear) {
      set({ error: "No month selected" });
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await showAppointmentsByStatus(status, date);
      set({
        filteredAppointments: data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch appointments by status",
        loading: false,
      });
    }
  },

  fetchByType: async (status, type, date) => {
    const state = useAppointmentsStore.getState();
    if (!state.currentMonthYear) {
      set({ error: "No month selected" });
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await showAppointmentsByType(status, type, date);
      set({
        filteredAppointments: data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch appointments by type",
        loading: false,
      });
    }
  },

  cancelAppointment: async (id) => {
    set({ loading: true, error: null });
    try {
      await cancelAppointment(id);

      const state = useAppointmentsStore.getState();
      const updatedAll = state.allAppointments.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelled" } : apt
      );
      const updatedFiltered = state.filteredAppointments.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelled" } : apt
      );

      set({
        allAppointments: updatedAll,
        filteredAppointments: updatedFiltered,
        loading: false,
      });

      return true;
    } catch (error) {
      set({
        error: error.message || "Failed to cancel appointment",
        loading: false,
      });
      return false;
    }
  },

  /**
   * Cancel multiple appointments in a date/time range
   * @param {Object} payload
   * @param {string} payload.start_leave_date
   * @param {string} payload.end_leave_date
   * @param {string} payload.start_leave_time
   * @param {string} payload.end_leave_time
   */
  cancelAppointments: async (payload) => {
    set({ loading: true, error: null });
    try {
      await cancelAppointments(payload);

      // Optionally, you could also update state to mark affected appointments cancelled
      set({ loading: false });
      return true;
    } catch (error) {
      
      set({
        error: error.message || "Failed to cancel appointments",
        loading: false,
      });
      return false;
    }
  },

  clearFilters: () => {
    set({ filteredAppointments: [] });
  },

  setCurrentMonthYear: (monthYear) => {
    set({ currentMonthYear: monthYear });
  },

  showAppointmentResults: async (appointment_id) => {
    set({ loading: true, error: null });
    try {
      const data = await showAppointmentResults(appointment_id);
      set({ loading: false });
      return data;
    } catch (error) {
      set({
        error: error.message || "Failed to fetch appointment results",
        loading: false,
      });
      return null;
    }
  },
}));
