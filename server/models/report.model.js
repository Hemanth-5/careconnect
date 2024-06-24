import mongoose from "mongoose";

// Model for a report
// A report is detailed information about a patient's health
const ReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "Patients",
    },
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "Doctors",
    },
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    prescription: {
      type: mongoose.Types.ObjectId,
      ref: "Prescriptions",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: String,
    },
    testsOrdered: {
      type: [mongoose.Types.ObjectId],
      ref: "LabTests",
      default: [],
    },
    followUpDate: {
      type: Date,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Reports = mongoose.model("Reports", ReportSchema);
export default Reports;
