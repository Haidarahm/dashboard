import api from "./config";

export const getAllAppointments = async () => {
  try {
    const response = await api.get("/api/admin/showAllAppointments");
    return response.data;
  } catch (error) {
    console.error("Get all clinics error:", error);
    throw error;
  }
};
// Get appointments by doctor and date (expects date in MM-YYYY format)
export const getAllAppointmentsByDoctor = async (doctor_id, date) => {
  try {
    const response = await api.get("/api/admin/filteringAppointmentByDoctor", {
      params: {
        doctor_id,
        date,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get all clinics error:", error);
    throw error;
  }
};
// Get appointments by status and date (expects date in MM-YYYY format)
export const getAllAppointmentsByStatus = async (status, date) => {
  try {
    const response = await api.post("/api/admin/filteringAppointmentByStatus", {
      status,
      date,
    });
    return response.data;
  } catch (error) {
    console.error("Get all clinics error:", error);
    throw error;
  }
};

// Get appointments by status, doctor and date (expects date in MM-YYYY format)
export const getAllAppointmentsByStatusAndDoctors = async (
  status,
  doctor_id,
  date
) => {
  try {
    const response = await api.post(
      "/api/admin/filterByDoctorStatus",
      {
        status,
        doctor_id,
        date,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Get appointments by status and doctor error:", error);
    throw error;
  }
};

// Get appointments by month (expects date in MM-YYYY format)
export const getAppointmentsByMonth = async (date) => {
  console.log(date);
  try {
    const response = await api.post("/api/admin/filteringAppointmentsByDate", {
      date,
    });
    return response.data;
  } catch (error) {
    console.error("Get appointments by month error:", error);
    throw error;
  }
};
