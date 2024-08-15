import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    report: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
    notes: String,
  },
  { timestamps: true }
);

const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema);

export default MedicalReport;

// Description of the medical report model:
// The medical report model consists of the following fields:
// patientId: The ID of the patient for whom the medical report is created.
// doctorId: The ID of the doctor who created the medical report.
// report: The content of the medical report.
// date: The date the medical report was created.
// prescription: The ID of the prescription associated with the medical report.
// notes: Additional notes or comments related to the medical report.
// timestamps: The timestamps for the medical report model.
