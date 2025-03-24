import PatientRecord from "../models/patientRecord.model.js";

// Get all records for a specific doctor
const getDoctorPatientRecords = async (doctorId) => {
  try {
    return await PatientRecord.find({ doctor: doctorId })
      .populate({
        path: "patient",
        populate: { path: "user", select: "fullname email profilePicture" },
      })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "fullname email profilePicture" },
      })
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Error fetching doctor patient records: " + error.message);
  }
};

// Get a specific record by ID
const getPatientRecordById = async (recordId) => {
  try {
    return await PatientRecord.findById(recordId)
      .populate({
        path: "patient",
        populate: { path: "user", select: "fullname email profilePicture" },
      })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "fullname email profilePicture" },
      });
  } catch (error) {
    throw new Error("Error fetching patient record: " + error.message);
  }
};

// Create a new patient record
const createPatientRecord = async (recordData) => {
  try {
    const newPatientRecord = new PatientRecord({
      patient: recordData.patient,
      doctor: recordData.doctor, // Make sure doctor field is included
      records: recordData.records.map((record) => ({
        ...record,
        date: record.date || new Date(),
      })),
    });

    return await newPatientRecord.save();
  } catch (error) {
    console.error("Error creating patient record:", error);
    throw new Error(`Error creating patient record: ${error.message}`);
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

// Delete a patient record
const deletePatientRecord = async (recordId) => {
  try {
    return await PatientRecord.findByIdAndDelete(recordId);
  } catch (error) {
    throw new Error("Error deleting patient record: " + error.message);
  }
};

// Add attachments to a record
const addAttachments = async (recordId, attachments) => {
  try {
    const record = await PatientRecord.findById(recordId);
    if (!record) {
      throw new Error("Record not found");
    }

    // Add new attachments to existing ones
    record.attachments = [...(record.attachments || []), ...attachments];
    return await record.save();
  } catch (error) {
    throw new Error("Error adding attachments: " + error.message);
  }
};

// Get all records for a specific patient
const getPatientRecords = async (patientId) => {
  try {
    return await PatientRecord.find({ patient: patientId })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "username fullname email" },
      })
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Error fetching patient records: " + error.message);
  }
};

const PatientRecordService = {
  getDoctorPatientRecords,
  getPatientRecordById,
  createPatientRecord,
  updatePatientRecord,
  deletePatientRecord,
  addAttachments,
  getPatientRecords,
};

export default PatientRecordService;
