import { create } from "zustand";
import {
  getPatientsRecord,
  searchPatient,
  showPatientProfile,
  addPrescription,
  addMedicine,
} from "../../api/doctor/patients";

const usePatientsStore = create((set) => ({
  // State
  patients: [],
  patientProfile: null,
  loading: false,
  error: null,

  // Actions

  // Fetch all patients
  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getPatientsRecord();
      set({ patients: res, loading: false });
    } catch (err) {
      set({ error: err?.message || err.toString(), loading: false });
    }
  },

  // Search patient by name
  searchForPatient: async (name) => {
    set({ loading: true, error: null });
    try {
      const res = await searchPatient(name);
      set({ patients: res, loading: false });
    } catch (err) {
      set({ error: err?.message || err.toString(), loading: false });
    }
  },

  // Get individual patient profile
  fetchPatientProfile: async (patient_id) => {
    set({ loading: true, error: null });
    try {
      const res = await showPatientProfile(patient_id);
      set({ patientProfile: res, loading: false });
    } catch (err) {
      set({ error: err?.message || err.toString(), loading: false });
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
