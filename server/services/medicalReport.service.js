import MedicalReport from "../models/medicalReport.model.js";

// Create a new medical report
const createMedicalReport = async (data) => {
  try {
    const newReport = new MedicalReport(data);
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

const MedicalReportService = {
  createMedicalReport,
  updateMedicalReport,
};

export default MedicalReportService;
