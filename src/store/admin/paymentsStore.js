import { create } from "zustand";
import {
  showPaymentDetails,
  showPaymentDetailsByDate,
  showPaymentDetailsByDoctor,
} from "../../api/admin/payments";
import { toast } from "react-toastify";

export const usePaymentsStore = create((set) => ({
  paymentStats: {
    totalRevenue: 0,
    totalAppointments: 0,
    averagePayment: 0,
  },
  loading: false,
  error: null,

  fetchPayments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await showPaymentDetails();
      console.log(data)
      set({ paymentStats: data.monthlyPaymentInfo });
    } catch (error) {
      set({ error: error.message || "Failed to fetch payments" });
      toast.error(error.message || "Failed to fetch payments");
    } finally {
      set({ loading: false });
    }
  },

  fetchPaymentsByDate: async (date) => {
    set({ loading: true, error: null });
    try {
      const data = await showPaymentDetailsByDate(date);
      set({ paymentStats: data });
    } catch (error) {
      set({ error: error.message || "Failed to fetch payments by date" });
      toast.error(error.message || "Failed to fetch payments by date");
    } finally {
      set({ loading: false });
    }
  },

  fetchPaymentsByDoctor: async (doctorId) => {
    set({ loading: true, error: null });
    try {
      const data = await showPaymentDetailsByDoctor(doctorId);
      set({ paymentStats: data });
    } catch (error) {
      set({ error: error.message || "Failed to fetch payments by doctor" });
      toast.error(error.message || "Failed to fetch payments by doctor");
    } finally {
      set({ loading: false });
    }
  },

  clearPayments: () =>
    set({
      paymentStats: {
        totalRevenue: 0,
        totalAppointments: 0,
        averagePayment: 0,
      },
    }),
}));
