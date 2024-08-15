import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
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
    testName: {
      type: String,
      required: true,
    },
    result: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestResult",
    },
    date: {
      type: Date,
      required: true,
    },
    notes: String,
  },
  { timestamps: true }
);

const LabTest = mongoose.model("LabTest", labTestSchema);

export default LabTest;

// Description of the lab test model:
// The lab test model consists of the following fields:
// patientId: The ID of the patient for whom the lab test is conducted.
// doctorId: The ID of the doctor who ordered the lab test.
// testName: The name of the lab test.
// result: The result of the lab test (positive, negative, inconclusive).
// date: The date the lab test was conducted.
// notes: Additional notes or comments related to the lab test.
// timestamps: The timestamps for the lab test model.
