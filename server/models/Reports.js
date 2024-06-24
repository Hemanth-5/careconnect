import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    _id: String,
    doctorId: String,
    patientId: String,
    date: Date,
    symptoms: [String],
    diagnosis: String,
    medications: [
      {
        doctorId: String,
        medication: String,
        dosage: String,
        instructions: String,
      },
    ],
    test: [String],
    results: String,
    notes: String,
  },
  { timestamps: true },
);

const Reports = mongoose.model("Reports", ReportSchema);
export default Reports;
