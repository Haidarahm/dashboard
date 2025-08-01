import api from "./config";

// Get all vaccines with pagination (page, per_page in params)
export const getAllVaccins = async (page = 1, per_page = 10) => {
  try {
    const response = await api.get("/api/admin/show", {
      params: { page, per_page },
    });
    return response.data;
  } catch (error) {
    console.error("Get all vaccines error:", error);
    throw error;
  }
};

// Get vaccine details by vaccine_id
export const getVaccinDetails = async (vaccine_id) => {
  try {
    const response = await api.get("/api/admin/showDetails", {
      params: { vaccine_id },
    });
    return response.data;
  } catch (error) {
    console.error("Get vaccine details error:", error);
    throw error;
  }
};

// Create a new vaccine
export const createVaccin = async ({
  name,
  description,
  age_group,
  recommended_doses,
  price,
}) => {
  try {
    const response = await api.post("/api/admin/add", {
      name,
      description,
      age_group,
      recommended_doses,
      price,
    });
    return response.data;
  } catch (error) {
    console.error("Create vaccine error:", error);
    throw error;
  }
};

// Edit a vaccine
export const editVaccin = async ({
  name,
  description,
  age_group,
  recommended_doses,
  price,
}) => {
  try {
    const response = await api.post("/api/admin/edit", {
      name,
      description,
      age_group,
      recommended_doses,
      price,
    });
    return response.data;
  } catch (error) {
    console.error("Edit vaccine error:", error);
    throw error;
  }
};

// Remove a vaccine (expects vaccine_id in body)
export const removeVaccin = async (vaccine_id) => {
  console.log(vaccine_id);
  try {
    const response = await api.delete("/api/admin/remove", {
      params: {vaccine_id},
    });
    return response.data;
  } catch (error) {
    console.error("Remove vaccine error:", error);
    throw error;
  }
};
