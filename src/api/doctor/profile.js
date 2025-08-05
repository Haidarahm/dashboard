import api from "./doctorConfig";

// Base URL for doctor APIs
const endpoint = "/api/doctor";

// Show doctor profile
export const showProfile = async () => {
  try {
    const response = await api.get(`${endpoint}/profile`);
    return response.data;
  } catch (error) {
    console.error("Show profile error:", error);
    throw error;
  }
};

// Show available work days
export const showAvailableWorkDays = async () => {
  try {
    const response = await api.get(`${endpoint}/availableWorkDays`);
    return response.data;
  } catch (error) {
    console.error("Show available work days error:", error);
    throw error;
  }
};

// Show doctor reviews
export const showDoctorReviews = async () => {
  try {
    const response = await api.get(`${endpoint}/showDoctorReviews`);
    return response.data;
  } catch (error) {
    console.error("Show doctor reviews error:", error);
    throw error;
  }
};

// Edit doctor profile
export const editProfile = async (formData) => {
  try {
    const response = await api.post(
      `${endpoint}/editProfile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Edit profile error:", error);
    throw error;
  }
};
