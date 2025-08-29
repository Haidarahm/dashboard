import api from "../../config/config";

// Fetch doctors for secretary
export const fetchDoctors = async (page, size) => {
  try {
    const response = await api.get(`/api/secretary/showDoctors`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
