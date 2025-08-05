import { create } from "zustand";
import {
  showAllAppointmentsByDate,
  showAppointmentsByStatus,
  showAppointmentsByType,
  cancelAppointment,
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

      // Update the appointments list after cancellation
      // const state = useAppointmentsStore.getState();
      // const updatedAllAppointments = state.allAppointments.map((appt) =>
      //   appt.id === id ? { ...appt, status: "cancelled" } : appt
      // );
      // const updatedFilteredAppointments = state.filteredAppointments.map(
      //   (appt) => (appt.id === id ? { ...appt, status: "cancelled" } : appt)
      // );

      set({
        // allAppointments: updatedAllAppointments,
        // filteredAppointments: updatedFilteredAppointments,
        loading: false,
      });

      return true; // Indicate success
    } catch (error) {
      set({
        error: error.message || "Failed to cancel appointment",
        loading: false,
      });
      return false; // Indicate failure
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
}));
