import api from "./doctorConfig";

export const showAllAppointmentsByDate = async (date) => {
  const response = await api.post("/api/doctor/filteringAppointmentsByDate", {
    date,
  });

  return response.data;
};

// export const showAppointmentDetails = async (appointment_id) => {
//   const response = await api.get("/api/doctor/showAppointmentDetails", {
//     params: { appointment_id },
//   });
//   return response.data;
// };

// Show appointments by type
export const showAppointmentsByStatus = async (status, date) => {
  const response = await api.post("/api/doctor/showAppointmentsByStatus", {
    status,
    date,
  });

  return response.data;
};
export const cancelAppointment = async (reservation_id) => {
  const response = await api.get("/api/doctor/cancelAppointment", {
    params: {
      reservation_id,
    },
  });

  return response.data;
};
export const showAppointmentsByType = async (status, type, date) => {
  const response = await api.post("/api/doctor/showAppointmentsByType", {
    status,
    type,
    date,
  });
  return response.data;
};

// Show patient appointments
export const showPatientAppointments = async (
  patient_id,
  page = 1,
  size = 5
) => {
  const response = await api.get("/api/doctor/showpatientAppointments", {
    params: {
      patient_id,
      page,
      size,
    },
  });
  return response.data;
};

export const showAppointmentResults = async (appointment_id) => {
  const response = await api.get("/api/doctor/showAppointmantResults", {
    params: { appointment_id },
  });
  return response.data;
};

// Cancel appointment
// export const cancelAppointment = async (reservation_id) => {
//   const response = await api.post("/api/doctor/cancelAppointment", null, {
//     params: { reservation_id },
//   });
//   return response.data;
// };

// Edit schedule
// export const editSchedule = async ({
//   start_leave_date,
//   end_leave_date,
//   start_leave_time,
//   end_leave_time,
// }) => {
//   const response = await api.post("/api/doctor/editSchedule", {
//     start_leave_date,
//     end_leave_date,
//     start_leave_time,
//     end_leave_time,
//   });
//   return response.data;
// };
