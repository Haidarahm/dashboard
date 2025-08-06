import { create } from "zustand";
import {
  getPatientsRecord,
  searchPatient,
  showPatientProfile,
  addPrescription,
  addMedicine,
} from "../../api/doctor/patients";

const usePatientsStore = create((set, get) => ({
  // State
  patients: [],
  patientProfile: null,
  loading: false,
  profileLoading: false,
  error: null,
  currentPage: 1,
  total: 0,
  perPage: 10,
  searchQuery: "",

  // Actions

  // Fetch all patients with pagination (resets search)
  fetchPatients: async (page = 1, perPage = 10) => {
    set({ loading: true, error: null, searchQuery: "" });
    try {
      const res = await getPatientsRecord(page, perPage);
      set({
        patients: res.data,
        total: res.meta?.total || 0,
        currentPage: res.meta?.current_page || 1,
        perPage: res.meta?.per_page || 10,
        loading: false,
      });
    } catch (err) {
      set({ error: err?.message || err.toString(), loading: false });
    }
  },

  // Search patient by name (with pagination if supported)
  searchForPatient: async (name, page = 1, perPage = 10) => {
    set({ loading: true, error: null, searchQuery: name });
    try {
      const res = await searchPatient(name);
      // If the API returns paginated data, handle meta; otherwise, just set patients
      set({
        patients: res.Patients || res,
        total:
          res.meta?.total || (Array.isArray(res.data) ? res.data.length : 0),
        currentPage: res.meta?.current_page || 1,
        perPage: res.meta?.per_page || perPage,
        loading: false,
      });
    } catch (err) {
      set({ error: err?.message || err.toString(), loading: false });
    }
  },

  // Get individual patient profile
  fetchPatientProfile: async (patient_id) => {
    set({ profileLoading: true, error: null });
    try {
      const res = await showPatientProfile(patient_id);
      set({ patientProfile: res, profileLoading: false });
    } catch (err) {
      set({ error: err?.message || err.toString(), profileLoading: false });
    }
  },

  // Add prescription
  createPrescription: async (patient_id) => {
    try {
      const res = await addPrescription(patient_id);
      return res; // return prescription ID or success response
    } catch (err) {
      set({ error: err?.message || err.toString() });
      return null;
    }
  },

  // Add medicine to a prescription
  createMedicine: async (medicineData) => {
    try {
      const res = await addMedicine(medicineData);
      return res;
    } catch (err) {
      set({ error: err?.message || err.toString() });
      return null;
    }
  },

  // Reset error
  clearError: () => set({ error: null }),
}));

export default usePatientsStore;
