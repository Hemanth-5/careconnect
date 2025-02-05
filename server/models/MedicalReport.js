import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  reportType: { type: String, required: true },
  reportData: { type: String }, // Could store path to file or raw report data
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  createdAt: { type: Date, default: Date.now },
});

const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema);
export default MedicalReport;
