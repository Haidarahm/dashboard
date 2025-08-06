import api from "./doctorConfig";

// Add prescription
export const addPrescription = async (patient_id) => {
  const response = await api.post("/api/doctor/addPrescription", {
    patient_id,
  });
  return response.data;
};

// Add medicine to prescription
export const addMedicine = async (medicineData) => {
  const response = await api.post("/api/doctor/addMedicine", {
    name: medicineData.name,
    dose: medicineData.dose,
    frequency: medicineData.frequency,
    strength: medicineData.strength,
    until: medicineData.until,
    whenToTake: medicineData.whenToTake,
    prescription_id: medicineData.prescription_id,
    note: medicineData.note,
  });
  return response.data;
};

// Complete prescription
export const completePrescription = async (prescriptionData) => {
  const response = await api.post("/api/doctor/completPrescription", {
    note: prescriptionData.note,
    id: prescriptionData.id,
  });
  return response.data;
};
