import { create } from "zustand";
import {
  requestAnalyze,
  showPatientAnalysis,
  showPatientAnalysisByClinic,
} from "../../api/doctor/analyze";

const useAnalyzeStore = create((set, get) => ({
  // State
  analysisRequests: [],
  patientAnalysis: [],
  clinicAnalysis: [],
  loading: false,
  error: null,
  requestLoading: false,
  patientAnalysisLoading: false,
  clinicAnalysisLoading: false,

  // Actions

  // Request analyze
  requestAnalyzeAction: async (data) => {
    set({ requestLoading: true, error: null });
    try {
      const response = await requestAnalyze(data);
      const state = get();
      set({
        analysisRequests: [...state.analysisRequests, response],
        requestLoading: false,
      });
      return response;
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        requestLoading: false,
      });
      return null;
    }
  },

  // Show patient analysis
  showPatientAnalysisAction: async (data) => {
    set({ patientAnalysisLoading: true, error: null });
    try {
      const response = await showPatientAnalysis(data);
      set({
        patientAnalysis: response,
        patientAnalysisLoading: false,
      });
      return response;
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        patientAnalysisLoading: false,
      });
      return null;
    }
  },

  // Show patient analysis by clinic
  showPatientAnalysisByClinicAction: async (data) => {
    set({ clinicAnalysisLoading: true, error: null });
    try {
      const response = await showPatientAnalysisByClinic(data);
      set({
        clinicAnalysis: response,
        clinicAnalysisLoading: false,
      });
      return response;
    } catch (err) {
      set({
        error: err?.message || err.toString(),
        clinicAnalysisLoading: false,
      });
      return null;
    }
  },

  // Add analysis request to local state (for UI)
  addAnalysisRequestToState: (analysisRequest) => {
    const state = get();
    set({ analysisRequests: [...state.analysisRequests, analysisRequest] });
  },

  // Remove analysis request from local state
  removeAnalysisRequestFromState: (requestId) => {
    const state = get();
    set({
      analysisRequests: state.analysisRequests.filter(
        (request) => request.id !== requestId
      ),
    });
  },

  // Update analysis request in local state
  updateAnalysisRequestInState: (requestId, updatedRequest) => {
    const state = get();
    set({
      analysisRequests: state.analysisRequests.map((request) =>
        request.id === requestId ? { ...request, ...updatedRequest } : request
      ),
    });
  },

  // Set analysis requests
  setAnalysisRequests: (requests) => {
    set({ analysisRequests: requests });
  },

  // Set patient analysis
  setPatientAnalysis: (analysis) => {
    set({ patientAnalysis: analysis });
  },

  // Set clinic analysis
  setClinicAnalysis: (analysis) => {
    set({ clinicAnalysis: analysis });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset all state
  resetAnalyzeState: () => {
    set({
      analysisRequests: [],
      patientAnalysis: [],
      clinicAnalysis: [],
      loading: false,
      error: null,
      requestLoading: false,
      patientAnalysisLoading: false,
      clinicAnalysisLoading: false,
    });
  },

  // Clear specific data
  clearPatientAnalysis: () => set({ patientAnalysis: [] }),
  clearClinicAnalysis: () => set({ clinicAnalysis: [] }),
  clearAnalysisRequests: () => set({ analysisRequests: [] }),
}));

export default useAnalyzeStore;
