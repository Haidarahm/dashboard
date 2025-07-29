import { create } from "zustand";
import {
  getAllClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic,
  showDoctorsClinic,
} from "../../api/admin/clinics";

export const useClinicsStore = create((set) => ({
  clinics: [],
  clinicDetails: null,
  doctorsInClinic: [],
  loading: false,
  error: null,

  fetchClinics: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllClinics();
      set({ clinics: data.data || data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  fetchClinicById: async (clinic_id) => {
    set({ loading: true, error: null });
    try {
      const data = await getClinicById(clinic_id);
      set({ clinicDetails: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  addClinic: async (name, photo) => {
    set({ loading: true, error: null });
    try {
      await createClinic(name, photo);
    } catch (error) {
      set({ error, loading: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  editClinic: async (clinicId, name, photo) => {
    set({ loading: true, error: null });
    try {
      await updateClinic(clinicId, name, photo);
    } catch (error) {
      set({ error, loading: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeClinic: async (clinic_id) => {
    set({ loading: true, error: null });
    try {
      await deleteClinic(clinic_id);
    } catch (error) {
      set({ error, loading: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchDoctorsInClinic: async (clinicId) => {
    set({ loading: true, error: null });
    try {
      const data = await showDoctorsClinic(clinicId);
      set({ doctorsInClinic: data.data || data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));
