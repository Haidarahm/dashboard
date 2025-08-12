import api from "./doctorConfig";

// Fetch doctor's work days
export const showDoctorWorkDays = async () => {
  try {
    const response = await api.get("/api/doctor/showDoctorWorkDays");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Show available times (expects date format: DD/MM/YY e.g., 20/07/25)
export const showTimes = async (date) => {
  try {
    const response = await api.post("/api/doctor/showTimes", { date });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add checkup
// body: { patient_id, date, time, this_appointment_id }
export const addCheckup = async ({
  patient_id,
  date,
  time,
  this_appointment_id,
}) => {
  try {
    const response = await api.post("/api/doctor/addCheckup", {
      patient_id,
      date,
      time,
      this_appointment_id,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
