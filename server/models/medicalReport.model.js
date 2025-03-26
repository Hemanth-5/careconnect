import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema(
  {
    associatedPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    issuedByDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    reportType: { type: String, required: true },
    dateIssued: { type: Date, default: Date.now },
    document: {
      type: { type: String, enum: ["pdf", "image", "text"] },
      url: { type: String },
      size: { type: Number },
    },
    status: {
      type: String,
      enum: ["completed", "pending", "processing", "failed"],
      default: "pending",
    },
    comments: { type: String },
    // New fields to include related data
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    patientRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PatientRecord",
      },
    ],
    // Optional metadata for report generation
    reportMetadata: {
      includeSummary: { type: Boolean, default: true },
      includeAppointments: { type: Boolean, default: true },
      includePrescriptions: { type: Boolean, default: true },
      includeRecords: { type: Boolean, default: true },
      dateRange: {
        startDate: { type: Date },
        endDate: { type: Date },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("MedicalReport", medicalReportSchema);
