import api from "./config";

// Get all payment details
export const showPaymentDetails = async () => {
  try {
    const response = await api.get("/api/admin/showAllPayments");
    console.log("haidar")
    return response.data;
  } catch (error) {
    console.error("Get payment details error:", error);
    throw error;
  }
};

// Get payment details by date (expects date in MM-YYYY format)
export const showPaymentDetailsByDate = async (date) => {
  try {
    const response = await api.post("/api/admin/showPaymentDetailsByDate", {
      date,
    });
    return response.data;
  } catch (error) {
    console.error("Get payment details by date error:", error);
    throw error;
  }
};

// Get payment details by doctor (doctor_id in params)
export const showPaymentDetailsByDoctor = async (doctor_id) => {
  try {
    const response = await api.get("/api/admin/showPaymentDetailsByDoctor", {
      params: { doctor_id },
    });
    return response.data;
  } catch (error) {
    console.error("Get payment details by doctor error:", error);
    throw error;
  }
};
