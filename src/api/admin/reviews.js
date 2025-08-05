import api from "../admin/config";

// Get all doctor reviews
export const showDoctorReviews = async (doctor_id, page, pageSize) => {
  const response = await api.get("/api/admin/showDoctorReviews", {
    params: { doctor_id, page, size: pageSize },
  });
  return response.data;
};

// Delete a review by review_id
export const deleteReview = async (review_id) => {
  const response = await api.delete("/api/admin/deleteReview", {
    params: { review_id },
  });
  return response.data;
};
