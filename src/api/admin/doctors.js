// File: src/api/doctors.js
import axios from "axios";
import api from "./config";

// Function to create a new doctor
export const createDoctor = async (doctorData) => {
  try {
    const response = await api.post(`/api/admin/addDoctor`, doctorData);
    return response.data;
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

// Function to fetch all doctors with pagination
export const fetchDoctors = async (page, per_page ) => {
  try {
    const response = await api.get(`/api/admin/showDoctors`, {
      params: { page, size:per_page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error; // Re-throw the error for handling in the component
  }
};


export const showDoctorReviews = async (doctorId) => {
  try {

    const response = await api.get(`/api/admin/showDoctorReviewsEndpoint`, {
      params: { doctor_id: doctorId },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for doctor ${doctorId}:`, error);
    throw error; // Re-throw the error for handling in the component
  }
};

// Function to show details for a specific doctor
export const showDoctorDetails = async (doctorId) => {
  try {
    // Assuming the endpoint takes doctor_id as a query parameter
    const response = await api.get(`/api/admin/showDoctorDetails`, {
      params: { doctor_id: doctorId },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for doctor ${doctorId}:`, error);
    throw error; // Re-throw the error for handling in the component
  }
};

export async function deleteDoctor(doctor_id) {
  const response = await api.delete("/api/admin/removeDoctor", {
    params: { doctor_id },
  });
  return response.data;
}

export async function showDoctorsByClinic(clinic_id) {
  const response = await api.get("/api/admin/showDoctorsClinic", {
    params: { clinic_id },
  });
  return response.data;
}
