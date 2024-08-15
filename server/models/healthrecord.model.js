import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalReport",
    },
  ],
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
  ],
  testResults: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestResult",
    },
  ],
  referrals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referral",
    },
  ],
  consultations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
    },
  ],
}, { timestamps: true });

const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);

export default HealthRecord;

// Description of the health record model:
// The health record model consists of the following fields:
// patientId: The ID of the patient associated with the health record.
// reports: An array of medical report IDs associated with the patient.
// prescriptions: An array of prescription IDs associated with the patient.
// testResults: An array of test result IDs associated with the patient.
// referrals: An array of referral IDs associated with the patient.
// consultations: An array of consultation IDs associated with the patient.