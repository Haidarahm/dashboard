import { create } from "zustand";
import {
  getPatientsRecord,
  searchPatient,
  showPatientProfile,
  addPrescription,
  addMedicine,
} from "../../api/doctor/patients";
import { showPatientAppointments } from "../../api/doctor/appointments";

const usePatientsStore = create((set, get) => ({
  // State
  patients: [],
  patientProfile: null,
  patientAppointments: null,
  loading: false,
  profileLoading: false,
  appointmentsLoading: false,
  error: null,
  currentPage: 1,
  total: 0,
  perPage: 10,
  searchQuery: "",
  // Patient appointments pagination
  appointmentsCurrentPage: 1,
  appointmentsPerPage: 5,
  appointmentsTotal: 0,

  // Actions

  // Fetch all patients with pagination (resets search)
  fetchPatients: async (page = 1, perPage = 5) => {
    set({ loading: true, error: null, searchQuery: "" });
    try {
      const res = await getPatientsRecord(page, perPage);
      set({
        patients: res.data,
        total: res.meta?.total || 0,
        currentPage: res.meta?.current_page || 1,
        perPage: res.meta?.per_page || 5,
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

  // Get patient appointments
  fetchPatientAppointments: async (patient_id, page = 1, size = 5) => {
    set({ appointmentsLoading: true, error: null });
    try {
      const res = await showPatientAppointments(patient_id, page, size);
      set({
        patientAppointments: res,
        appointmentsLoading: false,
        appointmentsCurrentPage: res.meta?.current_page || 1,
        appointmentsPerPage: res.meta?.per_page || size,
        appointmentsTotal: res.meta?.total || 0,
      });
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        appointmentsLoading: false,
      });
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
