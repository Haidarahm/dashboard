import api from "../api";

// Fetch children with pagination
export const fetchChildren = async (page = 1, size = 10) => {
  try {
    const response = await api.get(`/api/doctor/showChildren`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get child details
export const getChildRecord = async (childId) => {
  try {
    const response = await api.get(`/api/doctor/showChildRecord`, {
      params: {
        child_id: childId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add child records
export const addChildRecords = async (recordsData) => {
  try {
    const response = await api.post(`/api/doctor/addChildRecords`, recordsData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Edit child records
export const editChildRecords = async (recordsData) => {
  try {
    const response = await api.put(`/api/doctor/editChildRecords`, recordsData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get vaccines with pagination
export const fetchVaccines = async (page = 1, size = 10) => {
  try {
    const response = await api.get(`/api/doctor/showVaccines`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get vaccine records of a specific child
export const getChildVaccineRecords = async (childId, page = 1, size = 10) => {
  try {
    const response = await api.get(`/api/doctor/showVaccineRecords`, {
      params: {
        child_id: childId,
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get vaccine record details
export const getVaccineRecordDetails = async (vaccinationRecordId) => {
  try {
    const response = await api.get(`/api/doctor/showVaccineRecordsDetails`, {
      params: {
        vaccination_record_id: vaccinationRecordId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Edit vaccine record information
export const editVaccineRecordInfo = async (vaccineData) => {
  try {
    const response = await api.put(
      `/api/doctor/editVaccineRecordInfo`,
      vaccineData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get child appointments with pagination
export const getChildAppointments = async (
  page = 1,
  status = null,
  date = null
) => {
  try {
    const params = { page };
    if (status) params.status = status;
    if (date) params.date = date;

    const response = await api.get(`/api/doctor/showChildsAppointments`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get appointment vaccination record
export const getAppointmentVaccinationRecord = async (appointmentId) => {
  try {
    const response = await api.get(
      `/api/doctor/showAppointmentVaccinatioinRecord`,
      {
        params: {
          appointment_id: appointmentId,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
