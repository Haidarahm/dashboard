import { create } from "zustand";
import { showDoctorReviews, deleteReview } from "../../api/admin/reviews";

export const useReviewsStore = create((set, get) => ({
  reviews: [],
  loading: false,
  error: null,

  // Now accepts doctor_id as parameter
  fetchReviews: async (doctor_id = null) => {
    set({ loading: true, error: null });
    try {
      const data = await showDoctorReviews(doctor_id);
      // If API returns { data: [...] }, use data.data, else use data
      set({ reviews: data.data ? data.data : data, loading: false });
    } catch (err) {
      set({ error: "Failed to load reviews", loading: false });
    }
  },

  deleteReviewById: async (review_id) => {
    set({ loading: true, error: null });
    try {
      await deleteReview(review_id);
      // Remove the deleted review from state
      set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== review_id),
        loading: false,
      }));
    } catch (err) {
      set({ error: "Failed to delete review", loading: false });
    }
  },
}));
