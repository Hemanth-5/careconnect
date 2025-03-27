import PDFDocument from "pdfkit";
import { uploadPDF } from "./cloudinary.js";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a PDF document and uploads it to Cloudinary
 * @param {Object} reportData - Data to include in the report
 * @param {string} reportType - Type of report to generate
 * @returns {Object} - Cloudinary upload result with document details
 */
export async function generatePDF(reportData, reportType) {
  // Create a temporary file path
  const tempFilePath = path.join(os.tmpdir(), `report-${uuidv4()}.pdf`);

  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(tempFilePath);

      // Pipe PDF output to file
      doc.pipe(stream);

      // Add content to PDF based on report type and data
      addHeaderToDocument(doc, reportData.reportTitle);

      // Add metadata
      doc
        .fontSize(10)
        .text(`Generated: ${new Date().toLocaleString()}`, { align: "right" });
      doc.moveDown(2);

      switch (reportType) {
        case "patient-summary":
          addPatientSummary(doc, reportData);
          break;
        case "appointments":
          addAppointmentsReport(doc, reportData);
          break;
        case "prescriptions":
          addPrescriptionsReport(doc, reportData);
          break;
        case "medical-records":
          addMedicalRecordsReport(doc, reportData);
          break;
        case "analytics":
          addAnalyticsReport(doc, reportData);
          break;
        default:
          doc.fontSize(12).text("Unknown report type", { align: "center" });
      }

      // Add footer
      addFooterToDocument(doc);

      // Finalize the PDF and end the stream
      doc.end();

      stream.on("finish", async () => {
        try {
          // Upload the generated PDF to Cloudinary
          const uploadResult = await uploadPDF(tempFilePath, {
            folder: "careconnect/medical_reports",
            resource_type: "auto",
            format: "pdf",
          });

          // Clean up the temporary file
          fs.unlink(tempFilePath, (err) => {
            if (err) console.error("Error removing temporary PDF file:", err);
          });

          // Return the Cloudinary upload result
          resolve({
            url: uploadResult.secure_url,
            filename: path.basename(uploadResult.secure_url),
            size: uploadResult.bytes,
            publicId: uploadResult.public_id,
          });
        } catch (uploadError) {
          reject(uploadError);
        }
      });

      stream.on("error", (error) => {
        // Clean up the temporary file in case of error
        fs.unlink(tempFilePath, () => {});
        reject(error);
      });
    } catch (error) {
      // Clean up the temporary file in case of error
      fs.unlink(tempFilePath, () => {});
      reject(error);
    }
  });
}

// Helper function to add header to the document
function addHeaderToDocument(doc, title) {
  doc.fontSize(25).text("CareConnect Healthcare", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(18).text(title || "Medical Report", { align: "center" });
  doc.moveDown(1);

  // Add a horizontal line
  doc
    .moveTo(50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .stroke();

  doc.moveDown(1);
}

// Helper function to add footer to the document
function addFooterToDocument(doc) {
  const footerY = doc.page.height - 50;

  doc.fontSize(10);
  doc.text("CareConnect Healthcare System", 50, footerY, { align: "center" });
  doc.text("Confidential Medical Document", 50, footerY + 15, {
    align: "center",
  });
}

// Add patient summary to the document
function addPatientSummary(doc, data) {
  // SECTION 1: PATIENT INFORMATION
  doc.fontSize(16).text("Patient Information", { underline: true });
  doc.moveDown(0.5);

  const patientDetails = data.patientDetails;
  doc.fontSize(12);
  doc.text(`Name: ${patientDetails.name}`);
  doc.text(`Age: ${patientDetails.age || "N/A"}`);
  doc.text(`Gender: ${patientDetails.gender || "N/A"}`);

  if (patientDetails.contactInfo) {
    doc.text(`Contact: ${patientDetails.contactInfo.phone || "N/A"}`);
    doc.text(`Address: ${patientDetails.contactInfo.address || "N/A"}`);
  }

  doc.text(`Blood Type: ${patientDetails.bloodType}`);
  doc.moveDown(1);

  // Medical Information Section
  doc.fontSize(14).text("Medical Information");
  doc.moveDown(0.5);

  // Allergies
  doc.fontSize(12).text("Allergies:");
  if (patientDetails.allergies && patientDetails.allergies.length) {
    patientDetails.allergies.forEach((allergy) => {
      doc.text(`• ${allergy}`, { indent: 20 });
    });
  } else {
    doc.text("No known allergies", { indent: 20 });
  }
  doc.moveDown(0.5);

  // Chronic Conditions
  doc.fontSize(12).text("Chronic Conditions:");
  if (
    patientDetails.chronicConditions &&
    patientDetails.chronicConditions.length
  ) {
    patientDetails.chronicConditions.forEach((condition) => {
      doc.text(`• ${condition}`, { indent: 20 });
    });
  } else {
    doc.text("No chronic conditions", { indent: 20 });
  }
  doc.moveDown(1);

  // Active Prescriptions Section
  if (data.activePrescriptions && data.activePrescriptions.length) {
    doc.fontSize(14).text("Current Medications");
    doc.moveDown(0.5);

    data.activePrescriptions.forEach((rx) => {
      const startDate = new Date(rx.startDate).toLocaleDateString();
      const endDate = rx.endDate
        ? new Date(rx.endDate).toLocaleDateString()
        : "Ongoing";

      doc.fontSize(12).text(`Prescription (${startDate} to ${endDate}):`);

      rx.medications.forEach((med) => {
        doc.text(`• ${med.name} - ${med.dosage}`, { indent: 20 });
        if (med.instructions) {
          doc
            .fontSize(10)
            .text(`Instructions: ${med.instructions}`, { indent: 30 });
        }
      });

      doc.moveDown(0.5);
    });
    doc.moveDown(1);
  }

  // Page break for better readability
  doc.addPage();

  // SECTION 2: APPOINTMENT HISTORY
  doc.fontSize(16).text("Appointment History", { underline: true });
  doc.moveDown(0.5);

  // Appointment statistics
  if (data.appointmentStatistics) {
    doc.fontSize(14).text("Appointment Statistics");
    doc.moveDown(0.5);

    const stats = data.appointmentStatistics;
    doc.fontSize(12);
    doc.text(`Total Appointments: ${stats.totalAppointments}`);
    doc.text(`Completed: ${stats.completedCount}`);
    doc.text(`Upcoming: ${stats.upcomingCount}`);
    doc.text(`Cancelled: ${stats.cancelledCount}`);
    doc.text(`Completion Rate: ${stats.completionRate}`);
    doc.moveDown(1);
  }

  // Recent appointments
  if (data.recentAppointments && data.recentAppointments.length) {
    doc.fontSize(14).text("Recent Appointments");
    doc.moveDown(0.5);

    data.recentAppointments.forEach((apt) => {
      const date = new Date(apt.date).toLocaleDateString();
      doc
        .fontSize(12)
        .text(`Date: ${date} - Status: ${apt.status}`, { continued: true });
      doc.text(`  (${apt.reason || "No reason provided"})`, { indent: 20 });

      if (apt.notes) {
        doc.fontSize(10).text(`Notes: ${apt.notes}`, { indent: 30 });
      }
      doc.moveDown(0.5);
    });
    doc.moveDown(1);
  }

  // Upcoming Appointments
  if (
    data.appointments &&
    data.appointments.upcoming &&
    data.appointments.upcoming.length
  ) {
    doc.fontSize(14).text("Upcoming Appointments");
    doc.moveDown(0.5);

    data.appointments.upcoming.forEach((apt) => {
      const date = new Date(apt.date).toLocaleDateString();
      const time = new Date(apt.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      doc.fontSize(12).text(`${date} at ${time}`);
      doc
        .fontSize(12)
        .text(`Reason: ${apt.reason || "Not specified"}`, { indent: 20 });

      if (apt.notes) {
        doc.fontSize(10).text(`Notes: ${apt.notes}`, { indent: 20 });
      }
      doc.moveDown(0.5);
    });
    doc.moveDown(1);
  }

  // Page break for better readability
  doc.addPage();

  // SECTION 3: PRESCRIPTION HISTORY
  doc.fontSize(16).text("Prescription History", { underline: true });
  doc.moveDown(0.5);

  // Prescription statistics
  if (data.prescriptionStatistics) {
    doc.fontSize(14).text("Prescription Statistics");
    doc.moveDown(0.5);

    const stats = data.prescriptionStatistics;
    doc.fontSize(12);
    doc.text(`Total Prescriptions: ${stats.totalPrescriptions}`);
    doc.text(`Active: ${stats.activeCount}`);
    doc.text(`Expired: ${stats.expiredCount}`);
    doc.text(`Completed: ${stats.completedCount}`);
    doc.moveDown(1);

    // Most prescribed medications
    if (
      stats.mostPrescribedMedications &&
      stats.mostPrescribedMedications.length
    ) {
      doc.fontSize(14).text("Most Prescribed Medications");
      doc.moveDown(0.5);

      stats.mostPrescribedMedications.forEach((med) => {
        doc
          .fontSize(12)
          .text(`${med.name}: ${med.count} times`, { indent: 20 });
      });
      doc.moveDown(1);
    }
  }

  // Active prescriptions
  if (
    data.prescriptions &&
    data.prescriptions.active &&
    data.prescriptions.active.length
  ) {
    doc.fontSize(14).text("Active Prescriptions");
    doc.moveDown(0.5);

    data.prescriptions.active.forEach((rx) => {
      const startDate = new Date(rx.startDate).toLocaleDateString();
      const endDate = rx.endDate
        ? new Date(rx.endDate).toLocaleDateString()
        : "Ongoing";

      doc.fontSize(12).text(`Date: ${startDate} to ${endDate}`);

      rx.medications.forEach((med) => {
        doc.text(`• ${med.name} - ${med.dosage}`, { indent: 20 });
        if (med.instructions) {
          doc
            .fontSize(10)
            .text(`Instructions: ${med.instructions}`, { indent: 30 });
        }
        if (med.frequency) {
          doc.fontSize(10).text(`Frequency: ${med.frequency}`, { indent: 30 });
        }
      });

      if (rx.notes) {
        doc.fontSize(10).text(`Notes: ${rx.notes}`, { indent: 20 });
      }
      doc.moveDown(0.5);
    });
    doc.moveDown(1);
  }

  // Page break for better readability
  doc.addPage();

  // SECTION 4: MEDICAL RECORDS
  doc.fontSize(16).text("Medical Records", { underline: true });
  doc.moveDown(0.5);

  // Medical record statistics
  if (data.medicalRecordStatistics) {
    doc.fontSize(14).text("Medical Record Statistics");
    doc.moveDown(0.5);

    const stats = data.medicalRecordStatistics;
    doc.fontSize(12);
    doc.text(`Total Records: ${stats.totalRecords}`);
    doc.text(`Total Entries: ${stats.totalEntries}`);
    doc.moveDown(0.5);

    // Record type breakdown
    if (stats.recordTypeBreakdown && stats.recordTypeBreakdown.length) {
      doc.fontSize(12).text("Record Type Distribution:");
      stats.recordTypeBreakdown.forEach((type) => {
        doc.text(`• ${type.type}: ${type.count} (${type.percentage})`, {
          indent: 20,
        });
      });
    }
    doc.moveDown(1);
  }

  // Recent medical records entries
  if (data.recentRecords && data.recentRecords.length) {
    doc.fontSize(14).text("Recent Medical Records");
    doc.moveDown(0.5);

    data.recentRecords.forEach((record) => {
      const date = new Date(record.date).toLocaleDateString();

      record.entries.forEach((entry) => {
        doc.fontSize(12).text(`Date: ${date}`, { continued: true });
        doc.text(` - Type: ${entry.type}`);
        doc.text(`Title: ${entry.title}`, { indent: 20 });

        if (entry.diagnosis) {
          doc.text(`Diagnosis: ${entry.diagnosis}`, { indent: 20 });
        }

        if (entry.treatment) {
          doc.text(`Treatment: ${entry.treatment}`, { indent: 20 });
        }

        doc.moveDown(0.5);
      });
    });
    doc.moveDown(1);
  }

  // Detailed records
  if (data.records && data.records.length) {
    doc.fontSize(14).text("Detailed Medical Records");
    doc.moveDown(0.5);

    data.records.forEach((record) => {
      const date = new Date(record.date).toLocaleDateString();
      doc.fontSize(12).text(`Record from ${date}`);

      record.entries.forEach((entry) => {
        doc.fontSize(12).text(`Type: ${entry.recordType}`, { indent: 20 });
        doc.fontSize(12).text(`Title: ${entry.title}`, { indent: 20 });

        if (entry.diagnosis) {
          doc
            .fontSize(12)
            .text(`Diagnosis: ${entry.diagnosis}`, { indent: 20 });
        }

        if (entry.findings) {
          doc.fontSize(12).text(`Findings: ${entry.findings}`, { indent: 20 });
        }

        if (entry.treatment) {
          doc
            .fontSize(12)
            .text(`Treatment: ${entry.treatment}`, { indent: 20 });
        }

        if (entry.notes) {
          doc.fontSize(10).text(`Notes: ${entry.notes}`, { indent: 20 });
        }

        doc.moveDown(0.5);
      });

      doc.moveDown(1);
    });
  }
}

// Add appointments report to the document
function addAppointmentsReport(doc, data) {
  // Add statistics section
  doc.fontSize(16).text("Appointment Statistics");
  doc.moveDown(0.5);

  const stats = data.statistics;
  doc.fontSize(12);
  doc.text(`Total Appointments: ${stats.totalAppointments}`);
  doc.text(`Completed: ${stats.completedCount}`);
  doc.text(`Upcoming: ${stats.upcomingCount}`);
  doc.text(`Cancelled: ${stats.cancelledCount}`);
  doc.text(`Completion Rate: ${stats.completionRate}`);
  doc.moveDown(1);

  // Upcoming Appointments Section
  if (data.appointments.upcoming && data.appointments.upcoming.length) {
    doc.fontSize(16).text("Upcoming Appointments");
    doc.moveDown(0.5);

    data.appointments.upcoming.forEach((apt) => {
      const date = new Date(apt.date).toLocaleDateString();
      const time = new Date(apt.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      doc.fontSize(12).text(`${date} at ${time}`);
      doc.fontSize(12).text(`Patient: ${apt.patientName}`, { indent: 20 });
      doc
        .fontSize(12)
        .text(`Reason: ${apt.reason || "Not specified"}`, { indent: 20 });

      if (apt.notes) {
        doc.fontSize(10).text(`Notes: ${apt.notes}`, { indent: 20 });
      }
      doc.moveDown(0.5);
    });
    doc.moveDown(1);
  }

  // Completed Appointments Section
  if (data.appointments.completed && data.appointments.completed.length) {
    doc.fontSize(16).text("Completed Appointments");
    doc.moveDown(0.5);

    data.appointments.completed.forEach((apt) => {
      const date = new Date(apt.date).toLocaleDateString();

      doc.fontSize(12).text(`${date} - Patient: ${apt.patientName}`);
      doc
        .fontSize(12)
        .text(`Reason: ${apt.reason || "Not specified"}`, { indent: 20 });

      if (apt.notes) {
        doc.fontSize(10).text(`Notes: ${apt.notes}`, { indent: 20 });
      }
      doc.moveDown(0.5);
    });
  }
}

// Add prescriptions report to the document
function addPrescriptionsReport(doc, data) {
  // Add statistics section
  doc.fontSize(16).text("Prescription Statistics");
  doc.moveDown(0.5);

  const stats = data.statistics;
  doc.fontSize(12);
  doc.text(`Total Prescriptions: ${stats.totalPrescriptions}`);
  doc.text(`Active: ${stats.activeCount}`);
  doc.text(`Expired: ${stats.expiredCount}`);
  doc.text(`Completed: ${stats.completedCount}`);
  doc.moveDown(1);

  // Most Prescribed Medications
  if (
    stats.mostPrescribedMedications &&
    stats.mostPrescribedMedications.length
  ) {
    doc.fontSize(16).text("Most Prescribed Medications");
    doc.moveDown(0.5);

    stats.mostPrescribedMedications.forEach((med) => {
      doc.fontSize(12).text(`${med.name}: ${med.count} times`, { indent: 20 });
    });
    doc.moveDown(1);
  }

  // Active Prescriptions Section
  if (data.prescriptions.active && data.prescriptions.active.length) {
    doc.fontSize(16).text("Active Prescriptions");
    doc.moveDown(0.5);

    data.prescriptions.active.forEach((rx) => {
      const startDate = new Date(rx.startDate).toLocaleDateString();
      const endDate = rx.endDate
        ? new Date(rx.endDate).toLocaleDateString()
        : "Ongoing";

      doc.fontSize(12).text(`Patient: ${rx.patientName}`);
      doc.fontSize(12).text(`Date: ${startDate} to ${endDate}`, { indent: 20 });

      rx.medications.forEach((med) => {
        doc.text(`• ${med.name} - ${med.dosage}`, { indent: 30 });
        if (med.instructions) {
          doc
            .fontSize(10)
            .text(`Instructions: ${med.instructions}`, { indent: 40 });
        }
      });

      if (rx.notes) {
        doc.fontSize(10).text(`Notes: ${rx.notes}`, { indent: 20 });
      }
      doc.moveDown(0.5);
    });
    doc.moveDown(1);
  }
}

// Add medical records report to the document
function addMedicalRecordsReport(doc, data) {
  // Patient details section
  doc.fontSize(16).text("Patient Information");
  doc.moveDown(0.5);

  const patientDetails = data.patientDetails;
  doc.fontSize(12);
  doc.text(`Name: ${patientDetails.name}`);
  doc.text(`Age: ${patientDetails.age || "N/A"}`);
  doc.text(`Gender: ${patientDetails.gender || "N/A"}`);
  doc.moveDown(1);

  // Records statistics
  doc.fontSize(16).text("Medical Record Statistics");
  doc.moveDown(0.5);

  const stats = data.statistics;
  doc.fontSize(12);
  doc.text(`Total Records: ${stats.totalRecords}`);
  doc.text(`Total Entries: ${stats.totalEntries}`);
  doc.moveDown(0.5);

  // Record type breakdown
  if (stats.recordTypeBreakdown && stats.recordTypeBreakdown.length) {
    doc.fontSize(12).text("Record Type Distribution:");
    stats.recordTypeBreakdown.forEach((type) => {
      doc.text(`• ${type.type}: ${type.count} (${type.percentage})`, {
        indent: 20,
      });
    });
  }
  doc.moveDown(1);

  // Records section
  if (data.records && data.records.length) {
    doc.fontSize(16).text("Medical Records");
    doc.moveDown(0.5);

    data.records.forEach((record) => {
      const date = new Date(record.date).toLocaleDateString();
      doc.fontSize(14).text(`Record from ${date}`);

      record.entries.forEach((entry) => {
        doc.fontSize(12).text(`Type: ${entry.recordType}`, { indent: 20 });
        doc.fontSize(12).text(`Title: ${entry.title}`, { indent: 20 });

        if (entry.diagnosis) {
          doc
            .fontSize(12)
            .text(`Diagnosis: ${entry.diagnosis}`, { indent: 20 });
        }

        if (entry.findings) {
          doc.fontSize(12).text(`Findings: ${entry.findings}`, { indent: 20 });
        }

        if (entry.treatment) {
          doc
            .fontSize(12)
            .text(`Treatment: ${entry.treatment}`, { indent: 20 });
        }

        if (entry.notes) {
          doc.fontSize(10).text(`Notes: ${entry.notes}`, { indent: 20 });
        }

        doc.moveDown(0.5);
      });

      doc.moveDown(1);
    });
  }
}

// Add analytics report to the document
function addAnalyticsReport(doc, data) {
  // Appointment Metrics Section
  doc.fontSize(16).text("Appointment Metrics");
  doc.moveDown(0.5);

  const aptMetrics = data.appointmentMetrics;
  doc.fontSize(12);
  doc.text(`Total Appointments: ${aptMetrics.total}`);
  doc.text(`Completed: ${aptMetrics.completed}`);
  doc.text(`Upcoming: ${aptMetrics.upcoming}`);
  doc.text(`Cancelled: ${aptMetrics.cancelled}`);
  doc.moveDown(1);

  // Appointment Trends
  if (data.appointmentTrends && data.appointmentTrends.length) {
    doc.fontSize(16).text("Appointment Trends by Month");
    doc.moveDown(0.5);

    data.appointmentTrends.forEach((trend) => {
      doc
        .fontSize(12)
        .text(`${trend.month}: ${trend.count} appointments`, { indent: 20 });
    });
    doc.moveDown(1);
  }

  // Prescription Metrics
  if (data.prescriptionMetrics) {
    doc.fontSize(16).text("Prescription Metrics");
    doc.moveDown(0.5);

    const rxMetrics = data.prescriptionMetrics;
    doc.fontSize(12);
    doc.text(`Total Prescriptions: ${rxMetrics.total}`);
    doc.text(`Active: ${rxMetrics.active}`);
    doc.text(`Expired: ${rxMetrics.expired}`);
    doc.text(`Completed: ${rxMetrics.completed}`);
    doc.moveDown(1);
  }

  // Medication Statistics
  if (data.medicationStats && data.medicationStats.topMedications) {
    doc.fontSize(16).text("Top Prescribed Medications");
    doc.moveDown(0.5);

    data.medicationStats.topMedications.forEach((med) => {
      doc.fontSize(12).text(`${med.name}: ${med.count} times`, { indent: 20 });
    });
    doc.moveDown(1);

    doc
      .fontSize(12)
      .text(
        `Total Medications Prescribed: ${data.medicationStats.totalMedications}`
      );
  }
}

export default generatePDF;
