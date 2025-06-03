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
    const response = await api.post("/Admin/add_Pharmacy", {
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
    const response = await api.put(`/Admin/update_Pharmacy`, {
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
    const response = await api.delete(`/pharmacies/${pharmacyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch all pharmacies
 * @param {Object} params - Optional query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {string} params.sort - Sort field
 * @param {string} params.order - Sort order (asc/desc)
 * @returns {Promise<Object>} - List of pharmacies with pagination info
 */
export const fetchAllPharmacies = async (params = {}) => {
  try {
    const response = await api.get("/pharmacies", { params });
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
export const searchPharmacies = async (name, params = {}) => {
  try {
    const response = await api.post("/pharmacies/search", {
      name,
      ...params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get a single pharmacy by ID
 * @param {number|string} pharmacyId - Pharmacy ID
 * @returns {Promise<Object>} - Pharmacy data
 */
export const getPharmacyById = async (pharmacyId) => {
  try {
    const response = await api.get(`/pharmacies/${pharmacyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get pharmacies within a specific radius from coordinates
 * @param {Object} location - Location parameters
 * @param {number} location.latitude - Center latitude
 * @param {number} location.longitude - Center longitude
 * @param {number} location.radius - Search radius in kilometers
 * @returns {Promise<Object>} - Nearby pharmacies
 */
export const getNearbyPharmacies = async (location) => {
  try {
    const response = await api.post("/pharmacies/nearby", {
      latitude: location.latitude,
      longitude: location.longitude,
      radius: location.radius,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get pharmacies that are currently open
 * @returns {Promise<Object>} - List of open pharmacies
 */
export const getOpenPharmacies = async () => {
  try {
    const response = await api.get("/pharmacies/open");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Bulk operations for pharmacies
 */
export const pharmacyBulkOperations = {
  /**
   * Create multiple pharmacies at once
   * @param {Array<Object>} pharmaciesData - Array of pharmacy data objects
   * @returns {Promise<Object>} - Bulk creation results
   */
  createMultiple: async (pharmaciesData) => {
    try {
      const response = await api.post("/pharmacies/bulk", {
        pharmacies: pharmaciesData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete multiple pharmacies
   * @param {Array<number|string>} pharmacyIds - Array of pharmacy IDs
   * @returns {Promise<Object>} - Bulk deletion results
   */
  deleteMultiple: async (pharmacyIds) => {
    try {
      const response = await api.delete("/pharmacies/bulk", {
        data: { ids: pharmacyIds },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

/**
 * Validation helper for pharmacy data
 * @param {Object} pharmacyData - Pharmacy data to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validatePharmacyData = (pharmacyData) => {
  const errors = [];

  // Required fields validation
  if (!pharmacyData.name || pharmacyData.name.trim() === "") {
    errors.push("Pharmacy name is required");
  }

  if (!pharmacyData.location || pharmacyData.location.trim() === "") {
    errors.push("Location is required");
  }

  if (!pharmacyData.phone || pharmacyData.phone.trim() === "") {
    errors.push("Phone number is required");
  }

  if (!pharmacyData.start_time) {
    errors.push("Start time is required");
  }

  if (!pharmacyData.finish_time) {
    errors.push("Finish time is required");
  }

  // Coordinate validation
  if (
    typeof pharmacyData.latitude !== "number" ||
    pharmacyData.latitude < -90 ||
    pharmacyData.latitude > 90
  ) {
    errors.push("Valid latitude is required (-90 to 90)");
  }

  if (
    typeof pharmacyData.longitude !== "number" ||
    pharmacyData.longitude < -180 ||
    pharmacyData.longitude > 180
  ) {
    errors.push("Valid longitude is required (-180 to 180)");
  }

  // Time format validation (basic check for HH:MM format)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (pharmacyData.start_time && !timeRegex.test(pharmacyData.start_time)) {
    errors.push("Start time must be in HH:MM format");
  }

  if (pharmacyData.finish_time && !timeRegex.test(pharmacyData.finish_time)) {
    errors.push("Finish time must be in HH:MM format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
