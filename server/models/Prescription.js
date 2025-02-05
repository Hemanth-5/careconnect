const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
    },
  ],
  dateIssued: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
