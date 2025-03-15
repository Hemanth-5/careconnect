import Prescription from "../models/prescription.model.js";

// Create a new prescription
export const createPrescription = async (data) => {
  try {
    const newPrescription = new Prescription(data);
    return await newPrescription.save();
  } catch (error) {
    throw new Error("Error creating prescription: " + error.message);
  }
};

// Update a prescription
export const updatePrescription = async (prescriptionId, updatedData) => {
  try {
    return await Prescription.findByIdAndUpdate(prescriptionId, updatedData, {
      new: true,
    });
  } catch (error) {
    throw new Error("Error updating prescription: " + error.message);
  }
};
