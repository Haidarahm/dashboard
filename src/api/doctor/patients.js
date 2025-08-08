import api from "./doctorConfig";

// Show patients API
export const getPatientsRecord = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get("/api/doctor/patientsRecord", {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error("Get patients record error:", error);
    throw error;
  }
};

// Search patient API
export const searchPatient = async (name) => {
  try {
    const response = await api.post("/api/doctor/searchPatient", { name });
    return response.data;
  } catch (error) {
    console.error("Search patient error:", error);
    throw error;
  }
};

// Show patient profile API
export const showPatientProfile = async (patient_id) => {
  try {
    const response = await api.get(`/api/doctor/showPatientProfile`, {
      params: {
        patient_id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Show patient profile error:", error);
    throw error;
  }
};

// Add prescription API
export const addPrescription = async (patient_id) => {
  try {
    const response = await api.post("/api/doctor/addPrescription", {
      patient_id,
    });
    return response.data;
  } catch (error) {
    console.error("Add prescription error:", error);
    throw error;
  }
};

// Add medicine API
export const addMedicine = async (medicineData) => {
  try {
    const response = await api.post("/api/doctor/addMedicine", {
      name: medicineData.name,
      dose: medicineData.dose,
      frequency: medicineData.frequency,
      strength: medicineData.strength,
      until: medicineData.until,
      whenToTake: medicineData.whenToTake,
      prescription_id: medicineData.prescription_id,
      note: medicineData.note,
    });
    return response.data;
  } catch (error) {
    console.error("Add medicine error:", error);
    throw error;
  }
};
