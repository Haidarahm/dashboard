import { create } from "zustand";
import {
  showDoctorWorkDays,
  showTimes,
  addCheckup,
} from "../../api/doctor/checkup";

const useCheckupStore = create((set, get) => ({
  // State
  workDays: [],
  times: [],
  lastCheckup: null,
  loadingWorkDays: false,
  loadingTimes: false,
  addingCheckup: false,
  error: null,

  // Actions
  showDoctorWorkDaysAction: async () => {
    set({ loadingWorkDays: true, error: null });
    try {
      const response = await showDoctorWorkDays();
      // Assuming API returns an array or { data: [] }
      const days = Array.isArray(response) ? response : response?.data || [];
      set({ workDays: days, loadingWorkDays: false });
      return response;
    } catch (err) {
      set({ error: err?.message || err.toString(), loadingWorkDays: false });
      return null;
    }
  },

  showTimesAction: async (date) => {
    set({ loadingTimes: true, error: null });
    try {
      const response = await showTimes(date);
      const times = Array.isArray(response) ? response : response?.data || [];
      set({ times, loadingTimes: false });
      return response;
    } catch (err) {
      set({ error: err?.message || err.toString(), loadingTimes: false });
      return null;
    }
  },

  addCheckupAction: async (payload) => {
    set({ addingCheckup: true, error: null });
    try {
      const response = await addCheckup(payload);
      set({ lastCheckup: response, addingCheckup: false });
      return response;
    } catch (err) {
      set({ error: err?.message || err.toString(), addingCheckup: false });
      return null;
    }
  },

  // Utility setters/clearers
  setWorkDays: (workDays) => set({ workDays }),
  setTimes: (times) => set({ times }),
  clearTimes: () => set({ times: [] }),
  clearLastCheckup: () => set({ lastCheckup: null }),
  clearError: () => set({ error: null }),
  resetCheckupState: () =>
    set({
      workDays: [],
      times: [],
      lastCheckup: null,
      loadingWorkDays: false,
      loadingTimes: false,
      addingCheckup: false,
      error: null,
    }),
}));

export default useCheckupStore;
