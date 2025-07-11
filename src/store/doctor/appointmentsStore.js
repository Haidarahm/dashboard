import { create } from "zustand";
import {
  showAllAppointments,
  showAppointmentsByStatus,
  showAppointmentDetails,
  showPatientAppointments,
  cancelAppointment,
} from "../../api/doctor/appointments";

export const useDoctorAppointmentsStore = create((set, get) => ({
  appointments: [],
  filteredAppointments: [],
  loading: false,
  error: null,
  filters: {
    status: "",
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
        showFilters: false,
      },
    }),
  fetchAllAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await showAllAppointments();
      set({ appointments: data, filteredAppointments: data });
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
      set({ filteredAppointments: data });
    } catch (err) {
      set({ error: "Failed to filter appointments by status" });
    } finally {
      set({ loading: false });
    }
  },
  applyFilters: async () => {
    const { status } = get().filters;
    const { appointments, fetchAppointmentsByStatus } = get();
    if (!status) {
      set((state) => ({ filteredAppointments: state.appointments }));
      return;
    }
    await fetchAppointmentsByStatus(status);
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
