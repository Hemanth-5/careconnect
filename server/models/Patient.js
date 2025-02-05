const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicalHistory: [
    {
      condition: String,
      diagnosisDate: Date,
      treatment: String,
    },
  ],
  appointments: [
    {
      doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
      appointmentDate: Date,
      status: { type: String, enum: ["pending", "completed", "cancelled"] },
    },
  ],
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
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
