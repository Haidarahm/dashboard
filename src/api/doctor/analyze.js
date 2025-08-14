import api from "../../config/config";

// Request analyze
export const requestAnalyze = async (data) => {
  try {
    const response = await api.post("/api/doctor/requestAnalyse", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Show patient analysis by status
export const showPatientAnalysisByStatus = async (data) => {
  try {
    const response = await api.post(
      "/api/doctor/showPatientAnalysisByStatus",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Show all patient analysis
export const showAllAnalysis = async (patient_id) => {
  try {
    const response = await api.get("/api/doctor/showPatientAnalysis", {
      params: { patient_id },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Show patient analysis by clinic
export const showPatientAnalysisByClinic = async (data) => {
  try {
    const response = await api.post(
      "/api/doctor/showPatientAnalysisByClinic",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Show clinics
export const showClinics = async () => {
  try {
    const response = await api.get("/api/doctor/showClinics");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
