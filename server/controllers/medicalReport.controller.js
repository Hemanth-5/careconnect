import MedicalReportService from "../services/medicalReport.service.js";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";

/**
 * Get all medical reports for a doctor
 */
export const getDoctorReports = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const reports = await MedicalReportService.getDoctorReports(doctor._id);
    // console.log(reports);
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching doctor reports:", error);
    res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
};

/**
 * Get a specific medical report by ID
 */
export const getMedicalReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await MedicalReportService.getReportById(reportId); // Fixed to use correct method name

    if (!report) {
      return res.status(404).json({ message: "Medical report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching medical report:", error);
    res
      .status(500)
      .json({ message: "Error fetching medical report", error: error.message });
  }
};

/**
 * Create a new medical report
 */
export const createMedicalReport = async (req, res) => {
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

    // Prepare report data with doctor information
    const reportData = {
      ...req.body,
      issuedByDoctor: doctor._id,
      dateIssued: new Date(),
      status: "pending", // Default status
    };

    // Validate patient if provided
    if (reportData.associatedPatient) {
      const patientExists = await Patient.findById(
        reportData.associatedPatient
      );
      if (!patientExists) {
        return res.status(404).json({ message: "Patient not found" });
      }
    }

    const newReport = await MedicalReportService.createMedicalReport(
      reportData
    );

    // Link report to doctor
    doctor.issuedReports.push(newReport._id);
    await doctor.save();

    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating medical report:", error);
    res
      .status(500)
      .json({ message: "Error creating medical report", error: error.message });
  }
};

/**
 * Add items to a medical report
 */
export const addItemsToReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const {
      appointments = [],
      prescriptions = [],
      patientRecords = [],
    } = req.body;

    // console.log("Adding items to report:", reportId);
    // console.log("Appointments:", appointments);
    // console.log("Prescriptions:", prescriptions);
    // console.log("Patient records:", patientRecords);

    // Verify report exists
    const existingReport = await MedicalReportService.getReportById(reportId); // Fixed method name
    if (!existingReport) {
      return res.status(404).json({ message: "Medical report not found" });
    }

    // Get doctor info to verify authorization
    const user = await User.findById(req.user.userId);
    const doctor = await Doctor.findOne({ user: user._id });

    // Verify doctor owns this report
    if (
      existingReport.issuedByDoctor._id.toString() !== doctor._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this report" });
    }

    // Add items to the report
    const updatedReport = await MedicalReportService.addItemsToReport(
      reportId,
      {
        appointments,
        prescriptions,
        patientRecords,
      }
    );

    // console.log("Updated report:", updatedReport);

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error adding items to report:", error);
    res
      .status(500)
      .json({ message: "Error adding items to report", error: error.message });
  }
};

/**
 * Update a medical report
 */
export const updateMedicalReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const updatedData = req.body;

    // Verify report exists
    const existingReport = await MedicalReportService.getMedicalReportById(
      reportId
    );
    if (!existingReport) {
      return res.status(404).json({ message: "Medical report not found" });
    }

    // Get doctor info to verify authorization
    const user = await User.findById(req.user.userId);
    const doctor = await Doctor.findOne({ user: user._id });

    // Verify doctor owns this report
    if (existingReport.issuedByDoctor.toString() !== doctor._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this report" });
    }

    // Update report
    const updatedReport = await MedicalReportService.updateMedicalReport(
      reportId,
      updatedData
    );

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error updating medical report:", error);
    res
      .status(500)
      .json({ message: "Error updating medical report", error: error.message });
  }
};

/**
 * Delete a medical report
 */
export const deleteMedicalReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Verify report exists
    const existingReport = await MedicalReportService.getMedicalReportById(
      reportId
    );
    if (!existingReport) {
      return res.status(404).json({ message: "Medical report not found" });
    }

    // Get doctor info to verify authorization
    const user = await User.findById(req.user.userId);
    const doctor = await Doctor.findOne({ user: user._id });

    // Verify doctor owns this report
    if (existingReport.issuedByDoctor.toString() !== doctor._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this report" });
    }

    // Delete report
    await MedicalReportService.deleteMedicalReport(reportId);

    // Remove reference from doctor
    doctor.issuedReports = doctor.issuedReports.filter(
      (id) => id.toString() !== reportId
    );
    await doctor.save();

    res.status(200).json({ message: "Medical report deleted successfully" });
  } catch (error) {
    console.error("Error deleting medical report:", error);
    res
      .status(500)
      .json({ message: "Error deleting medical report", error: error.message });
  }
};

/**
 * Generate a PDF report based on patient data
 */
export const generateReport = async (req, res) => {
  try {
    const { type } = req.params;
    const reportParams = req.body;

    // Get doctor info
    const user = await User.findById(req.user.userId);
    const doctor = await Doctor.findOne({ user: user._id });

    // In a real implementation, this would generate a PDF
    // and store it or return download URL

    // For now, we'll create a medical report record
    const reportData = {
      reportType: type,
      issuedByDoctor: doctor._id,
      associatedPatient: reportParams.associatedPatient || null,
      dateIssued: new Date(),
      status: "approved",
      comments: reportParams.comments || "",
      // This would be the actual document URL in a real implementation
      document: {
        type: "pdf",
        url: `https://example.com/reports/${Date.now()}_${type}.pdf`,
        size: 1024, // Mock file size in KB
      },
    };

    const newReport = await MedicalReportService.createMedicalReport(
      reportData
    );

    // Link report to doctor
    doctor.issuedReports.push(newReport._id);
    await doctor.save();

    res.status(200).json({
      message: "Report generated successfully",
      report: newReport,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};
