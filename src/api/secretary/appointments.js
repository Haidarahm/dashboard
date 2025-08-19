import api from "../../config/config";

// Show all appointments (by date: MM-YYYY)
export const showAllAppointmentsByDate = async (date) => {
  const response = await api.post("/api/secretary/filteringAppointmentByDate", {
    date,
  });
  return response.data;
};

// Show appointments by doctor (doctor_id, date)
export const showAppointmentsByDoctor = async (doctor_id, date) => {
  const response = await api.post(
    "/api/secretary/filteringAppointmentByDoctor",
    { doctor_id, date }
  );
  return response.data;
};

// Show appointments by status (status, date)
export const showAppointmentsByStatus = async (status, date) => {
  const response = await api.post(
    "/api/secretary/filteringAppointmentByStatus",
    { status, date }
  );
  return response.data;
};

// Show appointments by doctor and status (date, status, doctor_id)
export const showAppointmentsByDoctorStatus = async (
  date,
  status,
  doctor_id
) => {
  const response = await api.post(
    "/api/secretary/filteringAppointmentByDoctorStatus",
    { date, status, doctor_id }
  );
  return response.data;
};

// Show appointments by clinic (date, clinic_id)
export const showAppointmentsByClinic = async (date, clinic_id) => {
  const response = await api.post(
    "/api/secretary/filteringAppointmentByClinic",
    { date, clinic_id }
  );
  return response.data;
};

// Cancel appointment (reservation_id in params)
export const cancelAppointment = async (reservation_id) => {
  const response = await api.get("/api/secretary/cancelAppointment", {
    params: { reservation_id },
  });
  return response.data;
};

// Cancel doctor's appointments (edit schedule)
// Body: start_leave_date, end_leave_date, start_leave_time, end_leave_time, doctor_id
export const cancelDoctorsAppointments = async ({
  start_leave_date,
  end_leave_date,
  start_leave_time,
  end_leave_time,
  doctor_id,
}) => {
  const response = await api.post("/api/secretary/editSchedule", {
    start_leave_date,
    end_leave_date,
    start_leave_time,
    end_leave_time,
    doctor_id,
  });
  return response.data;
};
