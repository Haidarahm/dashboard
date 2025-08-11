import api from "./doctorConfig";

// Request analyze
export const requestAnalyze = async (data) => {
  try {
    const response = await api.post("/api/doctor/requestAnalyse", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Show patient analysis
export const showPatientAnalysis = async (data) => {
  try {
    const response = await api.post("/api/doctor/showPatientAnalysis", data);
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
