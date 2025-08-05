import { create } from "zustand";
import {
  getAllAppointments,
  getAllAppointmentsByDoctor,
  getAllAppointmentsByStatus,
  getAllAppointmentsByStatusAndDoctors,
  getAppointmentsByMonth,
} from "../../api/admin/appointment";

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  loading: false,
  error: null,
  filters: {
    doctor_id: "",
    status: "",
    showFilters: false,
  },
  setFilters: (filterType, value, currentMonthDate = null) => {
    const currentFilters = get().filters;
    const newFilters = {
      ...currentFilters,
      [filterType]: value,
    };

    set({ filters: newFilters });

    // Automatically trigger API calls based on filter changes
    if (filterType === "status" && value) {
      // If both status and doctor are selected, use combined filter
      if (newFilters.doctor_id) {
        get().fetchAppointmentsByStatusAndDoctors(
          value,
          newFilters.doctor_id,
          currentMonthDate
        );
      } else {
        get().fetchAppointmentsByStatus(value, currentMonthDate);
      }
    } else if (filterType === "doctor_id" && value) {
      // If both status and doctor are selected, use combined filter
      if (newFilters.status) {
        get().fetchAppointmentsByStatusAndDoctors(
          newFilters.status,
          value,
          currentMonthDate
        );
      } else {
        get().fetchAppointmentsByDoctor(value, currentMonthDate);
      }
    } else if (filterType === "status" && !value) {
      // If status is cleared, check if doctor filter is still active
      if (newFilters.doctor_id) {
        get().fetchAppointmentsByDoctor(newFilters.doctor_id, currentMonthDate);
      } else {
        get().fetchAllAppointments();
      }
    } else if (filterType === "doctor_id" && !value) {
      // If doctor is cleared, check if status filter is still active
      if (newFilters.status) {
        get().fetchAppointmentsByStatus(newFilters.status, currentMonthDate);
      } else {
        get().fetchAllAppointments();
      }
    }
  },
  clearFilters: () => {
    set({
      filters: {
        doctor_id: "",
        status: "",
        showFilters: false,
      },
    });
    // Don't automatically fetch appointments - let the component decide what to fetch
  },
  fetchAllAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllAppointments();
      const data = response.data || response;
      set({ appointments: data });
    } catch {
      set({ error: "Failed to load appointments" });
    } finally {
      set({ loading: false });
    }
  },
  fetchAppointmentsByDoctor: async (doctorId, date) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllAppointmentsByDoctor(doctorId, date);
      const data = response.data || response;
      set({ appointments: data });
    } catch {
      set({ error: "Failed to filter appointments by doctor" });
    } finally {
      set({ loading: false });
    }
  },
  fetchAppointmentsByStatus: async (status, date) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllAppointmentsByStatus(status, date);
      const data = response.data || response;
      set({ appointments: data });
    } catch {
      set({ error: "Failed to filter appointments by status" });
    } finally {
      set({ loading: false });
    }
  },
  fetchAppointmentsByStatusAndDoctors: async (status, doctorId, date) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllAppointmentsByStatusAndDoctors(
        status,
        doctorId,
        date
      );
      const data = response.data || response;
      set({ appointments: data });
    } catch {
      set({ error: "Failed to filter appointments by status and doctor" });
    } finally {
      set({ loading: false });
    }
  },
  fetchAppointmentsByMonth: async (date) => {
    set({ loading: true, error: null });
    try {
      const data = await getAppointmentsByMonth(date);
      set({ appointments: data, loading: false });
    } catch {
      set({ error: "Failed to fetch appointments by month", loading: false });
    }
  },
}));
