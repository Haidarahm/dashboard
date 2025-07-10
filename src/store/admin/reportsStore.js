import { create } from "zustand";
import { showAllReports, showReportById } from "../../api/admin/reports";

const useReportsStore = create((set) => ({
  reports: [],
  total: 0,
  loading: false,
  error: null,
  selectedReport: null,

  fetchReports: async (size = 10, page = 1) => {
    set({ loading: true, error: null });
    try {
      const data = await showAllReports({ size, page });
      set({
        reports: data.data || [],
        total: data.meta.total || 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ loading: false, error, reports: [], total: 0 });
    }
  },

  fetchReportById: async (report_id) => {
    set({ loading: true, error: null });
    try {
      const data = await showReportById(report_id);
      set({ selectedReport: data, loading: false, error: null });
    } catch (error) {
      set({ loading: false, error, selectedReport: null });
    }
  },
}));

export default useReportsStore;
