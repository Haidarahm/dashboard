import { create } from "zustand";
import { showDoctorReviews, deleteReview } from "../../api/admin/reviews";

export const useReviewsStore = create((set, get) => ({
  reviews: [],
  loading: false,
  error: null,
  total: 0,

  // Now accepts doctor_id, page, and pageSize as parameters
  fetchReviews: async (doctor_id = null, page = 1, pageSize = 10) => {
    set({ loading: true, error: null });
    try {
      const data = await showDoctorReviews(doctor_id, page, pageSize);
      // If API returns { data: [...], meta: { total } }, use data.data and data.data.meta.total
      set({
        reviews: data.data ? data.data : data,
        total: data.meta.total || 0,
        loading: false,
      });
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
