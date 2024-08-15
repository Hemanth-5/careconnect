import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medication",
        required: true,
      },
    ],
    dosage: String,
    instructions: String,
    date: Date,
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;

// Description of the prescription model:
// The prescription model consists of the following fields:
// doctorId: The ID of the doctor who issued the prescription.
// patientId: The ID of the patient for whom the prescription is issued.
// medications: An array of medication IDs associated with the prescription.
// dosage: The dosage information for the prescription.
// instructions: The instructions for taking the medication.
// date: The date the prescription was issued.
// timestamps: The timestamps for the prescription model.
