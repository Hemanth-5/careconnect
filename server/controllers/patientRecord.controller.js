import PatientRecordService from "../services/patientRecord.service.js";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";

/**
 * Get all medical records for a doctor
 */
export const getDoctorPatientRecords = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const records = await PatientRecordService.getDoctorPatientRecords(
      doctor._id
    );

    // console.log(records);
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching patient records:", error);
    res
      .status(500)
      .json({ message: "Error fetching records", error: error.message });
  }
};

/**
 * Get a specific patient record by ID
 */
export const getPatientRecordById = async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await PatientRecordService.getPatientRecordById(recordId);

    if (!record) {
      return res.status(404).json({ message: "Patient record not found" });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error("Error fetching patient record:", error);
    res
      .status(500)
      .json({ message: "Error fetching patient record", error: error.message });
  }
};

/**
 * Create a new patient record
 */
export const createPatientRecord = async (req, res) => {
  try {
    // Get the doctor information
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // console.log(req.body);
    // Validate patient if provided
    if (req.body.patient) {
      const patientExists = await Patient.findById(req.body.patient);
      if (!patientExists) {
        return res.status(404).json({ message: "Patient not found" });
      }
    } else {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // Prepare record data with doctor information
    const recordData = {
      ...req.body,
      doctor: doctor._id,
      createdAt: new Date(),
    };

    const newRecord = await PatientRecordService.createPatientRecord(
      recordData
    );

    // Initialize records array if it doesn't exist
    if (!doctor.records) {
      doctor.records = [];
    }

    // Link record to doctor
    doctor.records.push(newRecord._id);
    await doctor.save();

    // Also add record to patient's records array
    const patient = await Patient.findById(req.body.patient);
    if (patient) {
      // Initialize medicalRecords array if it doesn't exist
      if (!patient.medicalRecords) {
        patient.medicalRecords = [];
      }

      patient.medicalRecords.push(newRecord._id);
      await patient.save();
    }

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error creating patient record:", error);
    res
      .status(500)
      .json({ message: "Error creating patient record", error: error.message });
  }
};

/**
 * Update a patient record
 */
export const updatePatientRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updatedData = req.body;

    // Verify record exists
    const existingRecord = await PatientRecordService.getPatientRecordById(
      recordId
    );
    if (!existingRecord) {
      return res.status(404).json({ message: "Patient record not found" });
    }

    // Get doctor info to verify authorization
    const user = await User.findById(req.user.userId);
    const doctor = await Doctor.findOne({ user: user._id });

    // Verify doctor owns this record or has access
    if (existingRecord.doctor.toString() !== doctor._id.toString()) {
      // Check if doctor is part of the patient's care team
      const patient = await Patient.findById(existingRecord.patient);
      if (
        !patient.assignedDoctors.some(
          (docId) => docId.toString() === doctor._id.toString()
        )
      ) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this record" });
      }
    }

    // Update record
    const updatedRecord = await PatientRecordService.updatePatientRecord(
      recordId,
      updatedData
    );

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error("Error updating patient record:", error);
    res
      .status(500)
      .json({ message: "Error updating patient record", error: error.message });
  }
};

/**
 * Delete a patient record
 */
export const deletePatientRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    // Verify record exists
    const existingRecord = await PatientRecordService.getPatientRecordById(
      recordId
    );
    if (!existingRecord) {
      return res.status(404).json({ message: "Patient record not found" });
    }

    // Get doctor info to verify authorization
    const user = await User.findById(req.user.userId);
    const doctor = await Doctor.findOne({ user: user._id });

    // Verify doctor owns this record
    if (existingRecord.doctor.toString() !== doctor._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this record" });
    }

    // Delete record
    await PatientRecordService.deletePatientRecord(recordId);

    // Remove reference from doctor
    doctor.records = doctor.records.filter((id) => id.toString() !== recordId);
    await doctor.save();

    // Remove reference from patient
    const patient = await Patient.findById(existingRecord.patient);
    if (patient) {
      patient.medicalRecords = patient.medicalRecords.filter(
        (id) => id.toString() !== recordId
      );
      await patient.save();
    }

    res.status(200).json({ message: "Patient record deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient record:", error);
    res
      .status(500)
      .json({ message: "Error deleting patient record", error: error.message });
  }
};

/**
 * Upload attachments for a patient record
 */
export const uploadRecordAttachments = async (req, res) => {
  try {
    const { recordId } = req.params;

    // Verify record exists
    const existingRecord = await PatientRecordService.getPatientRecordById(
      recordId
    );
    if (!existingRecord) {
      return res.status(404).json({ message: "Patient record not found" });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Process files (in a real implementation, this would handle file storage)
    const attachments = req.files.map((file) => ({
      filename: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      url: `/uploads/${file.filename}`, // This would be a real URL in production
    }));

    // Add attachments to record
    const updatedRecord = await PatientRecordService.addAttachments(
      recordId,
      attachments
    );

    res.status(200).json({
      message: "Attachments uploaded successfully",
      record: updatedRecord,
    });
  } catch (error) {
    console.error("Error uploading attachments:", error);
    res
      .status(500)
      .json({ message: "Error uploading attachments", error: error.message });
  }
};

/**
 * Get all records for a specific patient (for doctors)
 */
export const getPatientRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Verify patient exists
    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get doctor info to verify authorization
    const user = await User.findById(req.user.userId);
    const doctor = await Doctor.findOne({ user: user._id });

    // Verify doctor has access to this patient (is part of care team)
    if (
      !patientExists.assignedDoctors.some(
        (docId) => docId.toString() === doctor._id.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to access this patient's records" });
    }

    const records = await PatientRecordService.getPatientRecords(patientId);
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching patient records:", error);
    res
      .status(500)
      .json({ message: "Error fetching records", error: error.message });
  }
};
