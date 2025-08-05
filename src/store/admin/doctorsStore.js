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
  loading: false,
  error: null,
  selectedDoctor: null,
  doctorDetails: null,
  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
  setDoctorDetails: (details) => set({ doctorDetails: details }),
  clearDoctorDetails: () => set({ doctorDetails: null }),

  fetchDoctors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchDoctors();
      let doctorsData = [];
      if (Array.isArray(response)) {
        doctorsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        doctorsData = response.data;
      } else if (response.doctors && Array.isArray(response.doctors)) {
        doctorsData = response.doctors;
      } else {
        doctorsData = [];
      }
      set({ doctors: doctorsData });
    } catch (error) {
      set({ error: error.message || "Failed to fetch doctors" });
    } finally {
      set({ loading: false });
    }
  },

  createDoctor: async (doctorData) => {
    set({ loading: true, error: null });
    try {
      await createDoctor(doctorData);
      await get().fetchDoctors();
    } catch (error) {
      toast.error(error.response.data.message[0]);
      throw new Error(error);
    } finally {
      set({ loading: false });
    }
  },

  showDoctorDetails: async (doctorId) => {
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

  deleteDoctor: async (doctorId) => {
    set({ loading: true, error: null });
    try {
      await deleteDoctor(doctorId);
      await get().fetchDoctors();
    } catch (error) {
      set({ error: error.message || "Failed to delete doctor" });
    } finally {
      set({ loading: false });
    }
  },

  showDoctorsByClinic: async (clinicId) => {
    set({ loading: true, error: null });
    try {
      const doctors = await showDoctorsByClinic(clinicId);
      set({ doctors });
    } catch (error) {
      set({ error: error.message || "Failed to fetch doctors by clinic" });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useDoctorsTableStore = create((set) => ({
  doctors: [],
  meta: { current_page: 1, last_page: 1, total: 0, per_page: 3 },
  loading: false,
  error: null,
  fetchDoctors: async (page = 1, per_page = 3) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDoctorsApi(page, per_page);
      set({ doctors: data.data || [], meta: data.meta || {}, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));
