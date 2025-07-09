import { create } from "zustand";
import { fetchPatients } from "../api/patients";

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
}));

export default usePatientsStore;
