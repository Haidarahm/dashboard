import api from "../api";

// Fetch clinics for secretary
export const fetchClinics = async (page = 1, size = 5) => {
  try {
    const response = await api.get(`/api/secretary/showClinics`, {
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
