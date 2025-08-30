import api from "../../config/config";

// Fetch cancelled appointments for secretary with pagination
export const showCancelledAppointments = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get("/api/secretary/showCanceledAppointments", {
      params: {
        page,
        size: perPage,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
