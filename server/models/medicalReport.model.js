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
    status: { type: String, enum: ["approved", "pending"], default: "pending" },
    comments: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("MedicalReport", medicalReportSchema);
