import api from "../../config/config";

// Show doctors by clinic
export const showClinicDoctors = async (clinic_id) => {
  try {
    const response = await api.get("/api/doctor/showClinicDoctors", {
      params: { clinic_id },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Show doctor work days
export const showReferralDoctorWorkDays = async (doctor_id) => {
  try {
    const response = await api.get("/api/doctor/showReferralDoctorWorkDays", {
      params: { doctor_id },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Show doctor referral times
export const showReferralTimes = async (doctor_id, date) => {
  try {
    const response = await api.post("/api/doctor/showReferralTimes", {
      doctor_id,
      date,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add referral reservation
export const addReferralReservation = async ({
  patient_id,
  date,
  time,
  doctor_id,
}) => {
  try {
    const response = await api.post("/api/doctor/addReferralReservation", {
      patient_id,
      date,
      time,
      doctor_id,
    });
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
