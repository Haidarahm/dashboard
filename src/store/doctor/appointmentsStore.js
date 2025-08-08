import { create } from "zustand";
import {
  showAllAppointmentsByDate,
  showAppointmentsByStatus,
  showAppointmentsByType,
  cancelAppointment,
  showAppointmentResults,
} from "../../api/doctor/appointments";

export const useAppointmentsStore = create((set) => ({
  allAppointments: [],
  filteredAppointments: [],
  loading: false,
  error: null,
  currentMonthYear: null, // To track the currently viewed month-year

  // Fetch all appointments for a specific month-year (MM-YYYY)
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

  // Filter appointments by status for the current month-year
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

  // Filter appointments by type for the current month-year
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

  // Cancel an appointment
  cancelAppointment: async (id) => {
    set({ loading: true, error: null });
    try {
      await cancelAppointment(id);

      // Update both allAppointments and filteredAppointments
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
  // Clear all filters
  clearFilters: () => {
    set({ filteredAppointments: [] });
  },

  // Change current month-year view
  setCurrentMonthYear: (monthYear) => {
    set({ currentMonthYear: monthYear });
  },

  // Show appointment results by appointment_id
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
