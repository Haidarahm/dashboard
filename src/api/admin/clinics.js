// src/api/clinics.js
import api from "./config";

/**
 * Create a new clinic
 * @param {string} name - The name of the clinic
 * @param {File} photo - The photo of the clinic
 */
export const createClinic = async (name, photo) => {
  try {
    const formData = new FormData();
    formData.append("name", name);

    // Only append photo if it exists and is a valid File object
    if (photo && photo instanceof File) {
      formData.append("photo", photo);
    }

    const response = await api.post("/api/admin/addClinic", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create clinic error:", error);
    throw error;
  }
};

/**
 * Retrieve all clinics
 */
export const getAllClinics = async () => {
  try {
    const response = await api.get("/api/admin/showClinic");
    return response.data;
  } catch (error) {
    console.error("Get all clinics error:", error);
    throw error;
  }
};

/**
 * Delete a clinic by its ID
 * @param {string} clinicId
 */
export const deleteClinic = async (clinic_id) => {
  try {
    const response = await api.delete("/api/admin/removeClinic", {
      data: { clinic_id },
    });
    return response.data;
  } catch (error) {
    console.error("Delete clinic error:", error);
    throw error;
  }
};

/**
 * Show doctors in a clinic
 * @param {string} clinicId
 */
export const showDoctorsClinic = async (clinicId) => {
  try {
    // Note: This should probably be a GET request, not DELETE
    const response = await api.get("/api/admin/showDoctorsClinic", {
      params: { clinicId },
    });
    return response.data;
  } catch (error) {
    console.error("Show doctors clinic error:", error);
    throw error;
  }
};

/**
 * Update a clinic
 * @param {string} clinicId
 * @param {string} name
 * @param {File} photo
 */
export const updateClinic = async (clinicId, name, photo) => {
  try {
    const formData = new FormData();
    formData.append("clinic_id", clinicId);
    formData.append("name", name);

    // Only append photo if it exists and is a valid File object
    if (photo && photo instanceof File) {
      formData.append("photo", photo);
    }

    const response = await api.post("/api/admin/editClinic", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update clinic error:", error);
    throw error;
  }
};

export async function getClinicById(clinic_id) {
  const response = await api.get("/api/admin/showDetails", {
    params: { clinic_id },
  });
  return response.data;
}
