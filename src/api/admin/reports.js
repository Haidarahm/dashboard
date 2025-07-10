import api from "./config";

export const showAllReports = async ({ size = 10, page = 1 }) => {
  try {
    const response = await api.get(`/api/admin/showAllReports`, {
      params: { size, page },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const showReportById = async (report_id) => {
  try {
    const response = await api.get(`/api/admin/showReport`, {
      params: { report_id },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};
