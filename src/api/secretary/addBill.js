import api from "../../config/config";

// Add bill for an appointment
// Body: appointment_id, discount_points
export const addBill = async ({ appointment_id, discount_points }) => {
  const response = await api.post("/api/secretary/addBill", {
    appointment_id,
    discount_points,
  });
  return response.data;
};
