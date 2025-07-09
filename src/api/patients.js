import api from "./config";

export const fetchPatients = async ({ size = 10, page = 1 }) => {
  try {
    const response = await api.get("/api/admin/showPatients", {
      params: { size, page },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};
