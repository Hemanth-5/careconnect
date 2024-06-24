import mongoose from "mongoose";

// Model for a lab test
// Used to record a lab test and its information
const LabTestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "Patients",
    },
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "Doctors",
    },
    date: {
      type: Date,
      required: true,
    },
    test: {
      type: String,
      required: true,
    },
    results: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const LabTests = mongoose.model("Lab Tests", LabTestSchema);

export default LabTests;
