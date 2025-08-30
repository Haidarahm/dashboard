import api from "../../config/config";

// Show cancelled appointments with pagination
// Parameters: page (page number), limit (items per page)
export const showCancelledAppointments = async (page = 1, size = 5) => {
  const response = await api.get("/api/secretary/showCanceledAppointments", {
    params: {
      page,
      size,
    },
  });
  return response.data;
};
