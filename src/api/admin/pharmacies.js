// pharmacies.js - API functions for pharmacy management
import api from "./config";

/**
 * Create a new pharmacy
 * @param {Object} pharmacyData - Pharmacy data object
 * @param {string} pharmacyData.name - Pharmacy name
 * @param {string} pharmacyData.location - Pharmacy location/address
 * @param {string} pharmacyData.start_time - Opening time (e.g., "08:00")
 * @param {string} pharmacyData.finish_time - Closing time (e.g., "22:00")
 * @param {string} pharmacyData.phone - Pharmacy phone number
 * @param {number} pharmacyData.latitude - Latitude coordinate
 * @param {number} pharmacyData.longitude - Longitude coordinate
 * @returns {Promise<Object>} - Created pharmacy data
 */
export const createPharmacy = async (pharmacyData) => {
  try {
    const response = await api.post("/api/admin/add_Pharmacy", {
      name: pharmacyData.name,
      location: pharmacyData.location,
      start_time: pharmacyData.start_time,
      finish_time: pharmacyData.finish_time,
      phone: pharmacyData.phone,
      latitude: pharmacyData.latitude,
      longitude: pharmacyData.longitude,
    });
    return response.data;
  } catch (error) {
    console.log(error)
    throw error.response?.data.message[0] || error;
  }
};

/**
 * Update an existing pharmacy
 * @param {number|string} pharmacyId - Pharmacy ID
 * @param {Object} pharmacyData - Updated pharmacy data object
 * @param {string} pharmacyData.name - Pharmacy name
 * @param {string} pharmacyData.location - Pharmacy location/address
 * @param {string} pharmacyData.start_time - Opening time (e.g., "08:00")
 * @param {string} pharmacyData.finish_time - Closing time (e.g., "22:00")
 * @param {string} pharmacyData.phone - Pharmacy phone number
 * @param {number} pharmacyData.latitude - Latitude coordinate
 * @param {number} pharmacyData.longitude - Longitude coordinate
 * @returns {Promise<Object>} - Updated pharmacy data
 */
export const updatePharmacy = async (pharmacyId, pharmacyData) => {
  try {
    const response = await api.post(`/api/admin/update_Pharmacy`, {
      id: pharmacyId,
      name: pharmacyData.name,
      location: pharmacyData.location,
      start_time: pharmacyData.start_time,
      finish_time: pharmacyData.finish_time,
      phone: pharmacyData.phone,
      latitude: pharmacyData.latitude,
      longitude: pharmacyData.longitude,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a pharmacy
 * @param {number|string} pharmacyId - Pharmacy ID to delete
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deletePharmacy = async (pharmacyId) => {
  try {
    const response = await api.delete(`/api/admin/delete_Pharmacy`, {
      params: {
        id: pharmacyId,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch all pharmacies
 * @returns {Promise<Object>} - List of all pharmacies
 */
export const fetchAllPharmacies = async (page, pageSize) => {

  try {
    const response = await api.get("/api/admin/showAllPharmacies", {
      params: {
        size: pageSize,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search pharmacies by name
 * @param {string} name - Pharmacy name to search for
 * @param {Object} params - Optional additional parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @returns {Promise<Object>} - Search results with matching pharmacies
 */
export const searchPharmacies = async (name) => {
  console.log(name)
  try {
    const response = await api.post("/api/admin/searchPharmacy", {
      name,
     
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
