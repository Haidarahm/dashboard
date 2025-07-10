import { create } from "zustand";
import { fetchPatients } from "../../api/admin/patients";
import { removePatient } from "../../api/admin/patients";

const usePatientsStore = create((set) => ({
  patients: [],
  total: 0,
  loading: false,
  error: null,

  fetchPatients: async (size = 10, page = 1) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchPatients({ size, page });
      set({
        patients: data.data || [],
        total: data.meta?.total || 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ loading: false, error, patients: [], total: 0 });
    }
  },

  removePatient: async (patient_id) => {
    set({ loading: true, error: null });
    try {
      await removePatient(patient_id);
      set((state) => ({
        patients: state.patients.filter((p) => p.id !== patient_id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ loading: false, error });
    }
  },
}));

export default usePatientsStore;
