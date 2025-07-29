import { create } from "zustand";
import {
  getAllAppointments,
  getAllAppointmentsByDoctor,
  getAllAppointmentsByStatus,
  getAppointmentsByMonth,
} from "../../api/admin/appointment";

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  filteredAppointments: [],
  loading: false,
  error: null,
  filters: {
    doctor_id: "",
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
        doctor_id: "",
        status: "",
        showFilters: false,
      },
    }),
  fetchAllAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllAppointments();
      const data = response.data || response;
      set({ appointments: data, filteredAppointments: data });
    } catch (err) {
      set({ error: "Failed to load appointments" });
    } finally {
      set({ loading: false });
    }
  },
  fetchAppointmentsByDoctor: async (doctorId) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllAppointmentsByDoctor(doctorId);
      const data = response.data || response;
      set({ filteredAppointments: data });
    } catch (err) {
      set({ error: "Failed to filter appointments by doctor" });
    } finally {
      set({ loading: false });
    }
  },
  fetchAppointmentsByStatus: async (status) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllAppointmentsByStatus(status);
      const data = response.data || response;
      set({ filteredAppointments: data });
    } catch (err) {
      set({ error: "Failed to filter appointments by status" });
    } finally {
      set({ loading: false });
    }
  },
  fetchAppointmentsByMonth: async (date) => {
    set({ loading: true, error: null });
    try {
      const data = await getAppointmentsByMonth(date);
      set({ filteredAppointments: data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch appointments by month", loading: false });
    }
  },
  applyFilters: async () => {
    const { doctor_id, status } = get().filters;
    const {
      appointments,
      fetchAppointmentsByDoctor,
      fetchAppointmentsByStatus,
      fetchAllAppointments,
    } = get();
    // If both filters are empty, show all appointments
    if (!doctor_id && !status) {
      set((state) => ({ filteredAppointments: state.appointments }));
      return;
    }
    // If only doctor filter is applied
    if (doctor_id && !status) {
      await fetchAppointmentsByDoctor(doctor_id);
      return;
    }
    // If only status filter is applied
    if (status && !doctor_id) {
      await fetchAppointmentsByStatus(status);
      return;
    }
    // If both filters are applied, fetch all and filter locally
    if (doctor_id && status) {
      set({ loading: true });
      try {
        const response = await getAllAppointments();
        const allAppointments = response.data || response;
        const filtered = allAppointments.filter(
          (apt) =>
            apt.doctor_id.toString() === doctor_id.toString() &&
            apt.status === status
        );
        set({ filteredAppointments: filtered });
      } catch (err) {
        set({ error: "Failed to apply filters" });
      } finally {
        set({ loading: false });
      }
    }
  },
}));
