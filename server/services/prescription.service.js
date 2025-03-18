import Prescription from "../models/prescription.model.js";

// Get prescription by prescription id
const getPrescription = async (prescriptionId) => {
  try {
    return await Prescription.findById(prescriptionId);
  } catch (error) {
    throw new Error("Error fetching prescription: " + error.message);
  }
};

// Create a new prescription
const createPrescription = async (data) => {
  try {
    // console.log(data);
    const newPrescription = new Prescription(data);
    return await newPrescription.save();
  } catch (error) {
    throw new Error("Error creating prescription: " + error.message);
  }
};

// Update a prescription
const updatePrescription = async (prescriptionId, updatedData) => {
  try {
    return await Prescription.findByIdAndUpdate(prescriptionId, updatedData, {
      new: true,
    });
  } catch (error) {
    throw new Error("Error updating prescription: " + error.message);
  }
};

const PrescriptionService = {
  getPrescription,
  createPrescription,
  updatePrescription,
};

export default PrescriptionService;
