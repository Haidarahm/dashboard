import { create } from "zustand";
import {
  fetchDoctors,
  createDoctor,
  showDoctorDetails,
  deleteDoctor,
  showDoctorsByClinic,
  fetchDoctors as fetchDoctorsApi,
} from "../../api/admin/doctors";
import { toast } from "react-toastify";

export const useDoctorsStore = create((set, get) => ({
  doctors: [],
  meta: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
  loading: false,
  error: null,
  selectedDoctor: null,
  doctorDetails: null,
  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
  setDoctorDetails: (details) => set({ doctorDetails: details }),
  clearDoctorDetails: () => set({ doctorDetails: null }),

  fetchDoctors: async (page = 1, size = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchDoctorsApi(page, size);
      set({
        doctors: response.data || [],
        meta: response.meta || {
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: size,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: error.message || "Failed to fetch doctors" });
    } finally {
      set({ loading: false });
    }
  },

  createDoctorAction: async (doctorData) => {
    set({ loading: true, error: null });
    try {
      await createDoctor(doctorData);
      // Refresh the current page after creating
      const { meta } = get();
      await get().fetchDoctors(meta.current_page, meta.per_page);
    } catch (error) {
      toast.error(
        error.response?.data?.message?.[0] || "Failed to create doctor"
      );
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  showDoctorDetailsAction: async (doctorId) => {
    set({ loading: true, error: null });
    try {
      const details = await showDoctorDetails(doctorId);
      set({ doctorDetails: details });
    } catch (error) {
      set({ error: error.message || "Failed to fetch doctor details" });
    } finally {
      set({ loading: false });
    }
  },

  deleteDoctorAction: async (doctorId) => {
    set({ loading: true, error: null });
    try {
      await deleteDoctor(doctorId);
      // Refresh the current page after deleting
      const { meta } = get();
      await get().fetchDoctors(meta.current_page, meta.per_page);
    } catch (error) {
      set({ error: error.message || "Failed to delete doctor" });
    } finally {
      set({ loading: false });
    }
  },

  showDoctorsByClinicAction: async (clinicId) => {
    set({ loading: true, error: null });
    try {
      const response = await showDoctorsByClinic(clinicId);
      // Handle both array and paginated response
      if (Array.isArray(response)) {
        set({
          doctors: response,
          meta: {
            current_page: 1,
            last_page: 1,
            total: response.length,
            per_page: response.length,
          },
        });
      } else if (response.data && response.meta) {
        set({ doctors: response.data, meta: response.meta });
      } else {
        set({
          doctors: [],
          meta: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
        });
      }
    } catch (error) {
      set({ error: error.message || "Failed to fetch doctors by clinic" });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useDoctorsTableStore = create((set) => ({
  doctors: [],
  meta: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
  loading: false,
  error: null,
  fetchDoctors: async (page = 1, size = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDoctorsApi(page, size);
      set({ doctors: data.data || [], meta: data.meta || {}, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));
