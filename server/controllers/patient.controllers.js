import Patient from "../models/patient.model.js";

// Admin specific functionalities sepcific to patients
// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("userId");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient by ID
const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate("userId");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update patient by ID
const updatePatient = async (req, res) => {
  const updateDetails = req.body;
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      updateDetails,
      {
        new: true,
      }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete patient by ID
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patient specific functionalities, only for their own purpose
// Display patient speciifc details for a user
const displayPatientInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const patientDetails = await Patient.findOne({ userId });
    if (!patientDetails) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patientDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register themselves as a patient
const createPatient = async (req, res) => {
  try {
    const userId = req.user.id;
    const patientDetails = req.body;

    // Check for existing patient
    const existingPatient = await Patient.findOne({ userId });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    await Patient.create({ ...patientDetails, userId });

    res.status(201).json({ message: "Patient created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update patient by themselves
const updatePatientDetails = async (req, res) => {
  const updateDetails = req.body;
  try {
    const userId = req.user.id;
    const patient = await Patient.findOneAndUpdate({ userId }, updateDetails, {
      new: true,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
  displayPatientInfo,
  createPatient,
  updatePatientDetails,
};
