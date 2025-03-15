import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
    medicalReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalReport",
    },
    diagnosis: { type: String },
    treatmentProgress: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const patientRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    records: [medicalRecordSchema],
  },
  { timestamps: true }
);

export default mongoose.model("PatientRecord", patientRecordSchema);
