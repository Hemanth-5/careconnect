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

const MedicalReportService = {
  createMedicalReport,
};

export default MedicalReportService;
