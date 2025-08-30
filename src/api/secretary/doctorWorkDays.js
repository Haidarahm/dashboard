import api from "../../config/config";

// Fetch doctor work days for secretary
export const fetchDoctorWorkDays = async (doctor_id) => {
  try {
    const response = await api.get(`/api/secretary/showDoctorWorkDates`, {
      params: {
        doctor_id,
      },
    });

    // Handle different response formats
    console.log("API Response:", response); // Debug log

    // Check if response has data property
    if (response.data && response.data.available_dates) {
      return response.data.available_dates;
    }

    // Check if response has available_dates directly
    if (response.available_dates) {
      return response.available_dates;
    }

    // Check if response is an array
    if (Array.isArray(response)) {
      return response;
    }

    // Check if response.data is an array
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    console.warn("Unexpected response format:", response);
    return [];
  } catch (error) {
    console.error("Error fetching doctor work days:", error);
    throw error;
  }
};
