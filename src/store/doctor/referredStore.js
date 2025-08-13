import { create } from "zustand";
import {
  showClinicDoctors,
  showReferralDoctorWorkDays,
  showReferralTimes,
  addReferralReservation,
  showClinics,
} from "../../api/doctor/referred";

const useReferredStore = create((set, get) => ({
  // State
  clinicDoctors: [],
  doctorWorkDays: [],
  referralTimes: [],
  clinics: [],
  lastReferralReservation: null,
  loadingClinicDoctors: false,
  loadingWorkDays: false,
  loadingReferralTimes: false,
  loadingClinics: false,
  addingReferralReservation: false,
  error: null,

  // Actions

  // Show doctors by clinic
  showClinicDoctorsAction: async (clinic_id) => {
    set({ loadingClinicDoctors: true, error: null });
    try {
      const response = await showClinicDoctors(clinic_id);
      const doctors = Array.isArray(response) ? response : response?.data || [];
      set({ clinicDoctors: doctors, loadingClinicDoctors: false });
      return response;
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        loadingClinicDoctors: false,
      });
      return null;
    }
  },

  // Show doctor work days
  showReferralDoctorWorkDaysAction: async (doctor_id) => {
    set({ loadingWorkDays: true, error: null });
    try {
      const response = await showReferralDoctorWorkDays(doctor_id);
      const workDays = Array.isArray(response)
        ? response
        : response?.data || [];
      set({ doctorWorkDays: workDays, loadingWorkDays: false });
      return response;
    } catch (err) {
      set({ error: err?.message || err.toString(), loadingWorkDays: false });
      return null;
    }
  },

  // Show doctor referral times
  showReferralTimesAction: async (doctor_id, date) => {
    set({ loadingReferralTimes: true, error: null });
    try {
      const response = await showReferralTimes(doctor_id, date);
      const times = Array.isArray(response) ? response : response?.data || [];
      set({ referralTimes: times, loadingReferralTimes: false });
      return response;
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        loadingReferralTimes: false,
      });
      return null;
    }
  },

  // Show clinics
  showClinicsAction: async () => {
    set({ loadingClinics: true, error: null });
    try {
      const response = await showClinics();
      const clinics = Array.isArray(response) ? response : response?.data || [];
      set({ clinics, loadingClinics: false });
      return response;
    } catch (err) {
      set({ error: err?.message || err.toString(), loadingClinics: false });
      return null;
    }
  },

  // Add referral reservation
  addReferralReservationAction: async (payload) => {
    set({ addingReferralReservation: true, error: null });
    try {
      const response = await addReferralReservation(payload);
      set({
        lastReferralReservation: response,
        addingReferralReservation: false,
      });
      return response;
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        addingReferralReservation: false,
      });
      return null;
    }
  },

  // Utility setters/clearers
  setClinicDoctors: (doctors) => set({ clinicDoctors: doctors }),
  setDoctorWorkDays: (workDays) => set({ doctorWorkDays: workDays }),
  setReferralTimes: (times) => set({ referralTimes: times }),
  setClinics: (clinics) => set({ clinics }),
  clearReferralTimes: () => set({ referralTimes: [] }),
  clearLastReferralReservation: () => set({ lastReferralReservation: null }),
  clearClinics: () => set({ clinics: [] }),
  clearError: () => set({ error: null }),
  resetReferredState: () =>
    set({
      clinicDoctors: [],
      doctorWorkDays: [],
      referralTimes: [],
      clinics: [],
      lastReferralReservation: null,
      loadingClinicDoctors: false,
      loadingWorkDays: false,
      loadingReferralTimes: false,
      loadingClinics: false,
      addingReferralReservation: false,
      error: null,
    }),

  // Clear specific data
  clearClinicDoctors: () => set({ clinicDoctors: [] }),
  clearDoctorWorkDays: () => set({ doctorWorkDays: [] }),
  clearReferralTimes: () => set({ referralTimes: [] }),
  clearLastReferralReservation: () => set({ lastReferralReservation: null }),
}));

export default useReferredStore;
