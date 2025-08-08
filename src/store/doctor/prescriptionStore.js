import { create } from "zustand";
import {
  addPrescription,
  addMedicine,
  completePrescription,
  addMedicalInfo,
} from "../../api/doctor/prescription";

const usePrescriptionStore = create((set, get) => ({
  // State
  currentPrescription: null,
  medicines: [],
  loading: false,
  error: null,
  prescriptionLoading: false,
  medicineLoading: false,
  completionLoading: false,
  medicalInfoLoading: false,

  // Actions

  // Create a new prescription
  createPrescription: async (patient_id) => {
    set({ prescriptionLoading: true, error: null });
    try {
      const response = await addPrescription(patient_id);
      set({
        currentPrescription: response,
        prescriptionLoading: false,
      });
      return response;
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        prescriptionLoading: false,
      });
      return null;
    }
  },

  // Add medicine to prescription
  addMedicineToPrescription: async (medicineData) => {
    set({ medicineLoading: true, error: null });
    try {
      const response = await addMedicine(medicineData);
      const state = get();
      set({
        medicines: [...state.medicines, response],
        medicineLoading: false,
      });
      return response;
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        medicineLoading: false,
      });
      return null;
    }
  },

  // Complete prescription
  completePrescriptionAction: async (prescriptionData) => {
    set({ completionLoading: true, error: null });
    try {
      const response = await completePrescription(prescriptionData);
      set({
        currentPrescription: response,
        completionLoading: false,
      });
      return response;
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        completionLoading: false,
      });
      return null;
    }
  },

  // Add medical info
  addMedicalInfo: async (medicalData) => {
    set({ medicalInfoLoading: true, error: null });
    try {
      const response = await addMedicalInfo(medicalData);
      set({ medicalInfoLoading: false });
      return response;
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        medicalInfoLoading: false,
      });
      return null;
    }
  },

  // Add medicine to local state (for UI)
  addMedicineToState: (medicine) => {
    const state = get();
    set({ medicines: [...state.medicines, medicine] });
  },

  // Remove medicine from local state
  removeMedicineFromState: (medicineId) => {
    const state = get();
    set({
      medicines: state.medicines.filter((med) => med.id !== medicineId),
    });
  },

  // Update medicine in local state
  updateMedicineInState: (medicineId, updatedMedicine) => {
    const state = get();
    set({
      medicines: state.medicines.map((med) =>
        med.id === medicineId ? { ...med, ...updatedMedicine } : med
      ),
    });
  },

  // Clear current prescription
  clearCurrentPrescription: () => {
    set({
      currentPrescription: null,
      medicines: [],
      error: null,
    });
  },

  // Set current prescription
  setCurrentPrescription: (prescription) => {
    set({ currentPrescription: prescription });
  },

  // Set medicines
  setMedicines: (medicines) => {
    set({ medicines });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset all state
  resetPrescriptionState: () => {
    set({
      currentPrescription: null,
      medicines: [],
      loading: false,
      error: null,
      prescriptionLoading: false,
      medicineLoading: false,
      completionLoading: false,
      medicalInfoLoading: false,
    });
  },
}));

export default usePrescriptionStore;
