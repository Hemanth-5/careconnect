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
    console.log(`Fetching report with ID: ${reportId}`);

    const report = await MedicalReport.findById(reportId)
      .populate({
        path: "associatedPatient",
        populate: {
          path: "user",
          select: "fullname email profilePicture",
        },
      })
      .populate({
        path: "issuedByDoctor",
        populate: {
          path: "user",
          select: "fullname email profilePicture",
        },
      })
      // Properly populate appointments with relevant fields
      .populate({
        path: "appointments",
        select: "appointmentDate status reason patient doctor",
      })
      // Properly populate prescriptions with relevant fields
      .populate({
        path: "prescriptions",
        select: "medications startDate endDate notes patient doctor createdAt",
      })
      // Properly populate patient records with relevant fields
      .populate({
        path: "patientRecords",
        select: "patient doctor records createdAt",
      });

    console.log(`Report fetched:`, {
      id: report?._id,
      hasAppointments: report?.appointments?.length > 0,
      hasPrescriptions: report?.prescriptions?.length > 0,
      hasRecords: report?.patientRecords?.length > 0,
    });

    return report;
  } catch (error) {
    console.error(`Error fetching report: ${error.message}`);
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

// New function to get reports by patient
const getPatientReports = async (patientId) => {
  try {
    return await MedicalReport.find({ associatedPatient: patientId })
      .populate({
        path: "issuedByDoctor",
        populate: {
          path: "user",
          select: "fullname email profilePicture",
        },
      })
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Error fetching patient reports: " + error.message);
  }
};

// Add items to a report with improved error handling
const addItemsToReport = async (reportId, items) => {
  try {
    const {
      appointments = [],
      prescriptions = [],
      patientRecords = [],
    } = items;

    console.log("Service - Adding items to report:", reportId);
    console.log("Service - Items to add:", {
      appointments: appointments.length > 0 ? appointments : "None",
      prescriptions: prescriptions.length > 0 ? prescriptions : "None",
      patientRecords: patientRecords.length > 0 ? patientRecords : "None",
    });

    const report = await MedicalReport.findById(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    // Initialize arrays if they don't exist
    report.appointments = report.appointments || [];
    report.prescriptions = report.prescriptions || [];
    report.patientRecords = report.patientRecords || [];

    // Convert all IDs to strings for consistent comparison
    const existingAppointmentIds = report.appointments.map((id) =>
      id.toString()
    );
    const existingPrescriptionIds = report.prescriptions.map((id) =>
      id.toString()
    );
    const existingRecordIds = report.patientRecords.map((id) => id.toString());

    // Add new appointments that don't already exist
    if (appointments.length > 0) {
      const newAppointments = appointments.filter(
        (id) => !existingAppointmentIds.includes(id.toString())
      );
      if (newAppointments.length > 0) {
        console.log(
          `Adding ${newAppointments.length} new appointments to report`
        );
        report.appointments.push(...newAppointments);
      }
    }

    // Add new prescriptions that don't already exist
    if (prescriptions.length > 0) {
      const newPrescriptions = prescriptions.filter(
        (id) => !existingPrescriptionIds.includes(id.toString())
      );
      report.prescriptions.push(...newPrescriptions);
    }

    // Add new records that don't already exist
    if (patientRecords.length > 0) {
      const newRecords = patientRecords.filter(
        (id) => !existingRecordIds.includes(id.toString())
      );
      report.patientRecords.push(...newRecords);
    }

    console.log("Service - Updated report before save:", {
      appointmentsCount: report.appointments.length,
      prescriptionsCount: report.prescriptions.length,
      patientRecordsCount: report.patientRecords.length,
    });

    return await report.save();
  } catch (error) {
    console.error("Service - Error adding items:", error);
    throw new Error("Error adding items to report: " + error.message);
  }
};

const MedicalReportService = {
  getDoctorReports,
  getReportById,
  createMedicalReport,
  updateMedicalReport,
  deleteMedicalReport,
  getPatientReports,
  addItemsToReport,
};

export default MedicalReportService;
