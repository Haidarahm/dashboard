import { create } from "zustand";
import {
  showAllAppointments,
  showAppointmentsByStatus,
  showAppointmentDetails,
  showPatientAppointments,
  cancelAppointment,
  showAppointmentsByType,
} from "../../api/doctor/appointments";

export const useDoctorAppointmentsStore = create((set, get) => ({
  appointments: [],
  filteredAppointments: [],
  loading: false,
  error: null,
  filters: {
    status: "",
    type: "",
    showFilters: false,
  },
  setFilters: (filterType, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [filterType]: value,
      },
    })),
  clearFilters: () =>
    set({
      filters: {
        status: "",
        type: "",
        showFilters: false,
      },
    }),
  fetchAllAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await showAllAppointments();
      set({ appointments: data.data });
    } catch (err) {
      set({ error: "Failed to load appointments" });
    } finally {
      set({ loading: false });
    }
  },
  fetchAppointmentsByStatus: async (status) => {
    set({ loading: true, error: null });
    try {
      const data = await showAppointmentsByStatus(status);
      set({ filteredAppointments: data.data });
    } catch (err) {
      set({ error: "Failed to filter appointments by status" });
    } finally {
      set({ loading: false });
    }
  },
  fetchAppointmentsByType: async (status, type) => {
    set({ loading: true, error: null });
    try {
      const data = await showAppointmentsByType(status, type);
      set({ filteredAppointments: data.data });
    } catch (err) {
      set({ error: "Failed to filter appointments by type" });
    } finally {
      set({ loading: false });
    }
  },
  applyFilters: async () => {
    const { status, type } = get().filters;
    // If both filters are empty, show all appointments
    if (!status && !type) {
      set((state) => ({ filteredAppointments: state.appointments }));
      return;
    }
    // If only status filter is applied
    if (status && !type) {
      await get().fetchAppointmentsByStatus(status);
      return;
    }
    // If only type filter is applied
    if (type && !status) {
      await get().fetchAppointmentsByType("pending", type);
      return;
    }
    // If both filters are applied, call showAppointmentsByType with both
    if (status && type) {
      await get().fetchAppointmentsByType(status, type);
      return;
    }
  },
  fetchAppointmentDetails: async (appointment_id) => {
    set({ loading: true, error: null });
    try {
      const data = await showAppointmentDetails(appointment_id);
      return data;
    } catch (err) {
      set({ error: "Failed to fetch appointment details" });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  fetchPatientAppointments: async (patient_id) => {
    set({ loading: true, error: null });
    try {
      const data = await showPatientAppointments(patient_id);
      return data;
    } catch (err) {
      set({ error: "Failed to fetch patient appointments" });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  cancelAppointment: async (reservation_id) => {
    set({ loading: true, error: null });
    try {
      const data = await cancelAppointment(reservation_id);
      return data;
    } catch (err) {
      set({ error: "Failed to cancel appointment" });
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
