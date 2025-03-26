import MedicalReport from "../models/medicalReport.model.js";

// Get all reports for a doctor
const getDoctorReports = async (doctorId) => {
  console.log(doctorId);
  try {
    return await MedicalReport.find({ issuedByDoctor: doctorId })
      .populate({
        path: "associatedPatient",
        populate: {
          path: "user",
          select: "fullname email profilePicture",
        },
      })
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Error fetching doctor reports: " + error.message);
  }
};

// Get a specific report by ID
const getReportById = async (reportId) => {
  try {
    return await MedicalReport.findById(reportId)
      .populate({
        path: "associatedPatient",
        populate: {
          path: "user",
          select: "fullname email profilePicture",
        },
      })
      .populate({
        path: "issuedBy",
        populate: {
          path: "user",
          select: "fullname email profilePicture",
        },
      });
  } catch (error) {
    throw new Error("Error fetching report: " + error.message);
  }
};

// Create a new medical report
const createMedicalReport = async (reportData) => {
  try {
    const newReport = new MedicalReport(reportData);
    return await newReport.save();
  } catch (error) {
    throw new Error("Error creating medical report: " + error.message);
  }
};

// Update a medical report
const updateMedicalReport = async (reportId, updatedData) => {
  try {
    return await MedicalReport.findByIdAndUpdate(reportId, updatedData, {
      new: true,
    });
  } catch (error) {
    throw new Error("Error updating medical report: " + error.message);
  }
};

// Delete a medical report
const deleteMedicalReport = async (reportId) => {
  try {
    return await MedicalReport.findByIdAndDelete(reportId);
  } catch (error) {
    throw new Error("Error deleting medical report: " + error.message);
  }
};

const MedicalReportService = {
  getDoctorReports,
  getReportById,
  createMedicalReport,
  updateMedicalReport,
  deleteMedicalReport,
};

export default MedicalReportService;
