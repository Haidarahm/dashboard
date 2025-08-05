import { create } from "zustand";
import {
  getAllVaccins,
  getVaccinDetails,
  createVaccin,
  editVaccin,
  removeVaccin,
} from "../../api/admin/vaccins";

export const useVaccineStore = create((set, get) => ({
  vaccines: [],
  vaccineDetails: null,
  totalVaccins: 0,
  loading: false,
  error: null,

  fetchVaccines: async (page = 1, per_page = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await getAllVaccins(page, per_page);
      
      set({
        vaccines: data.vaccines || data.data || [],
        totalVaccins: data.meta.total || 0,
      });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  fetchVaccineDetails: async (vaccine_id) => {
    set({ loading: true, error: null });
    try {
      const data = await getVaccinDetails(vaccine_id);
      set({ vaccineDetails: data });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  addVaccine: async (vaccineData) => {
    set({ loading: true, error: null });
    try {
      await createVaccin(vaccineData);
    } catch (error) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateVaccine: async (vaccineData) => {
    set({ loading: true, error: null });
    try {
      await editVaccin(vaccineData);
    } catch (error) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteVaccine: async (vaccine_id) => {
    set({ loading: true, error: null });
    try {
      await removeVaccin(vaccine_id);
    } catch (error) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
