import PatientRecord from "../models/patientRecord.model.js";

// Create a new patient record
const createPatientRecord = async (data) => {
  try {
    // const newRecord = new PatientRecord(data);
    const { patient, records } = data;
    const existingPatient = await PatientRecord.findOne({
      patient: patient,
    });
    if (existingPatient) {
      existingPatient.records.push(...records);
      return await existingPatient.save();
    }
    const newRecord = new PatientRecord(data);
    return await newRecord.save();
  } catch (error) {
    throw new Error("Error creating patient record: " + error.message);
  }
};

// Update a patient record
const updatePatientRecord = async (recordId, updatedData) => {
  try {
    return await PatientRecord.findByIdAndUpdate(recordId, updatedData, {
      new: true,
    });
  } catch (error) {
    throw new Error("Error updating patient record: " + error.message);
  }
};

const PatientRecordService = {
  createPatientRecord,
  updatePatientRecord,
};

export default PatientRecordService;
