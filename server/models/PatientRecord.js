import mongoose from "mongoose";

const patientRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  }, // Reference to Patient
  medicalHistory: [
    {
      condition: String,
      diagnosisDate: Date,
      treatment: String,
    },
  ],
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }, // Doctor overseeing the treatment
  prescriptions: [
    {
      prescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
      doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
      dateIssued: { type: Date, default: Date.now },
    },
  ],
  labReports: [
    {
      reportId: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalReport" },
      reportType: { type: String },
    },
  ],
});

const PatientRecord = mongoose.model("PatientRecord", patientRecordSchema);
export default PatientRecord;
