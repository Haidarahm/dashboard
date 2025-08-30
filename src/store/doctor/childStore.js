import { create } from "zustand";
import {
  fetchChildren,
  getChildRecord,
  addChildRecords,
  editChildRecords,
  fetchVaccines,
  getChildVaccineRecords,
  getVaccineRecordDetails,
  editVaccineRecordInfo,
  getChildAppointments,
  getAppointmentVaccinationRecord,
} from "../../api/doctor/child";

const useChildStore = create((set, get) => ({
  // State
  children: [],
  selectedChild: null,
  childRecord: null,
  vaccines: [],
  childVaccineRecords: [],
  selectedVaccineRecord: null,
  childAppointments: [],
  appointmentVaccinationRecord: null,

  // Pagination metadata
  childrenMeta: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
  vaccinesMeta: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
  vaccineRecordsMeta: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
  appointmentsMeta: { current_page: 1, last_page: 1, total: 0, per_page: 10 },

  // Loading states
  loading: false,
  childrenLoading: false,
  childRecordLoading: false,
  vaccinesLoading: false,
  vaccineRecordsLoading: false,
  appointmentsLoading: false,

  // Error states
  error: null,
  childrenError: null,
  childRecordError: null,
  vaccinesError: null,
  vaccineRecordsError: null,
  appointmentsError: null,

  // Actions

  // Fetch children with pagination
  fetchChildren: async (page = 1, size = 10) => {
    set({ childrenLoading: true, childrenError: null });
    try {
      const response = await fetchChildren(page, size);
      set({
        children: response.data || [],
        childrenMeta: response.meta || {
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: size,
        },
        childrenLoading: false,
      });
    } catch (error) {
      set({
        childrenError: error.message || "Failed to fetch children",
        childrenLoading: false,
      });
      throw error;
    }
  },

  // Get child record details
  getChildRecord: async (childId) => {
    set({ childRecordLoading: true, childRecordError: null });
    try {
      const response = await getChildRecord(childId);
     
      set({
        childRecord: response.data || null,
        childRecordLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        childRecordError: error.message || "Failed to fetch child record",
        childRecordLoading: false,
      });
      throw error;
    }
  },

  // Add child records
  addChildRecords: async (recordsData) => {
    set({ loading: true, error: null });
    try {
      const response = await addChildRecords(recordsData);
      set({ loading: false });

      // Refresh child record if we have a selected child
      const { selectedChild } = get();
      if (selectedChild) {
        get().getChildRecord(selectedChild.id);
      }

      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to add child records",
        loading: false,
      });
      throw error;
    }
  },

  // Edit child records
  editChildRecords: async (recordsData) => {
    set({ loading: true, error: null });
    try {
      const response = await editChildRecords(recordsData);
      set({ loading: false });

      // Refresh child record if we have a selected child
      const { selectedChild } = get();
      if (selectedChild) {
        get().getChildRecord(selectedChild.id);
      }

      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to edit child records",
        loading: false,
      });
      throw error;
    }
  },

  // Fetch vaccines with pagination
  fetchVaccines: async (page = 1, size = 10) => {
    set({ vaccinesLoading: true, vaccinesError: null });
    try {
      const response = await fetchVaccines(page, size);
      set({
        vaccines: response.data || [],
        vaccinesMeta: response.meta || {
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: size,
        },
        vaccinesLoading: false,
      });
    } catch (error) {
      set({
        vaccinesError: error.message || "Failed to fetch vaccines",
        vaccinesLoading: false,
      });
      throw error;
    }
  },

  // Get child vaccine records
  getChildVaccineRecords: async (childId, page , size = 5) => {
    set({ vaccineRecordsLoading: true, vaccineRecordsError: null });
    try {
      const response = await getChildVaccineRecords(childId, page, size);
      set({
        childVaccineRecords: response.data || [],
        vaccineRecordsMeta: response.meta || {
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: size,
        },
        vaccineRecordsLoading: false,
      });
    } catch (error) {
      set({
        vaccineRecordsError: error.message || "Failed to fetch vaccine records",
        vaccineRecordsLoading: false,
      });
      throw error;
    }
  },

  // Get vaccine record details
  getVaccineRecordDetails: async (vaccinationRecordId) => {
    set({ loading: true, error: null });
    try {
      const response = await getVaccineRecordDetails(vaccinationRecordId);
      set({
        selectedVaccineRecord: response.data || null,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.message || "Failed to fetch vaccine record details",
        loading: false,
      });
      throw error;
    }
  },

  // Edit vaccine record information
  editVaccineRecordInfo: async (vaccineData) => {
    set({ loading: true, error: null });
    try {
      const response = await editVaccineRecordInfo(vaccineData);
      set({ loading: false });

      // Refresh vaccine records if we have a selected child
      const { selectedChild } = get();
      if (selectedChild) {
        get().getChildVaccineRecords(selectedChild.id);
      }

      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to edit vaccine record",
        loading: false,
      });
      throw error;
    }
  },

  // Get child appointments
  getChildAppointments: async (page = 1, status = null, date = null) => {
    set({ appointmentsLoading: true, appointmentsError: null });
    try {
      const response = await getChildAppointments(page, status, date);
      set({
        childAppointments: response.data || [],
        appointmentsMeta: response.meta || {
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: 10,
        },
        appointmentsLoading: false,
      });
    } catch (error) {
      set({
        appointmentsError:
          error.message || "Failed to fetch child appointments",
        appointmentsLoading: false,
      });
      throw error;
    }
  },

  // Get appointment vaccination record
  getAppointmentVaccinationRecord: async (appointmentId) => {
    set({ loading: true, error: null });
    try {
      const response = await getAppointmentVaccinationRecord(appointmentId);
      set({
        appointmentVaccinationRecord: response || null,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.message || "Failed to fetch appointment vaccination record",
        loading: false,
      });
      throw error;
    }
  },

  // Set selected child
  setSelectedChild: (child) => {
    set({ selectedChild: child });
  },

  // Clear selected child
  clearSelectedChild: () => {
    set({
      selectedChild: null,
      childRecord: null,
      childVaccineRecords: [],
      selectedVaccineRecord: null,
    });
  },

  // Clear all data
  clearAll: () => {
    set({
      children: [],
      selectedChild: null,
      childRecord: null,
      vaccines: [],
      childVaccineRecords: [],
      selectedVaccineRecord: null,
      childAppointments: [],
      appointmentVaccinationRecord: null,
      childrenMeta: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
      vaccinesMeta: { current_page: 1, last_page: 1, total: 0, per_page: 10 },
      vaccineRecordsMeta: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
      },
      appointmentsMeta: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
      },
      loading: false,
      childrenLoading: false,
      childRecordLoading: false,
      vaccinesLoading: false,
      vaccineRecordsLoading: false,
      appointmentsLoading: false,
      error: null,
      childrenError: null,
      childRecordError: null,
      vaccinesError: null,
      vaccineRecordsError: null,
      appointmentsError: null,
    });
  },
}));

export default useChildStore;
