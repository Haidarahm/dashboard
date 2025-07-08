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
export const getAllAppointmentsByDoctor = async (doctor_id) => {
  try {
    const response = await api.get("/api/admin/filteringAppointmentByDoctor", {
      params: {
        doctor_id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get all clinics error:", error);
    throw error;
  }
};
export const getAllAppointmentsByStatus = async (status) => {
  try {
    const response = await api.get("/api/admin/filteringAppointmentByStatus", {
      params: {
        status,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get all clinics error:", error);
    throw error;
  }
};
