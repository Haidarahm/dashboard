import { create } from "zustand";
import {
  showAllAppointmentsByDate,
  showAppointmentsByDoctor,
  showAppointmentsByStatus,
  showAppointmentsByDoctorStatus,
  showAppointmentsByClinic,
  cancelAppointment,
  cancelDoctorsAppointments,
} from "../../api/secretary/appointments";

const useSecretaryAppointmentsStore = create((set, get) => ({
  allAppointments: [],
  filteredAppointments: [],
  loading: false,
  error: null,
  currentMonthYear: null,

  fetchAllByDate: async (date) => {
    set({ loading: true, error: null });
    try {
      const data = await showAllAppointmentsByDate(date);
      set({
        allAppointments: data,
        currentMonthYear: date,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch appointments",
        loading: false,
      });
    }
  },

  fetchByDoctor: async (doctor_id, date) => {
    set({ loading: true, error: null });
    try {
      const data = await showAppointmentsByDoctor(doctor_id, date);
      set({
        filteredAppointments: data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch appointments by doctor",
        loading: false,
      });
    }
  },

  fetchByStatus: async (status, date) => {
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

  fetchByDoctorStatus: async (date, status, doctor_id) => {
    set({ loading: true, error: null });
    try {
      const data = await showAppointmentsByDoctorStatus(
        date,
        status,
        doctor_id
      );
      set({
        filteredAppointments: data,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error.message || "Failed to fetch appointments by doctor and status",
        loading: false,
      });
    }
  },

  fetchByClinic: async (date, clinic_id) => {
    set({ loading: true, error: null });
    try {
      const data = await showAppointmentsByClinic(date, clinic_id);
      set({
        filteredAppointments: data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch appointments by clinic",
        loading: false,
      });
    }
  },

  cancelAppointment: async (reservation_id) => {
    set({ loading: true, error: null });
    try {
      await cancelAppointment(reservation_id);
      // Optionally update state to reflect cancellation
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.message || "Failed to cancel appointment",
        loading: false,
      });
      return false;
    }
  },

  cancelDoctorsAppointments: async (payload) => {
    set({ loading: true, error: null });
    try {
      await cancelDoctorsAppointments(payload);
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.message || "Failed to cancel doctor's appointments",
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
}));

export default useSecretaryAppointmentsStore;
