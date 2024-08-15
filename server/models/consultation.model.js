import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "cancelled"],
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
    diagnosis: {
      type: String,
    },
    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;

// Description of the consultation model:
// The consultation model consists of the following fields:
// doctorId: The ID of the doctor conducting the consultation.
// patientId: The ID of the patient participating in the consultation.
// date: The date of the consultation.
// time: The time of the consultation.
// status: The status of the consultation (pending, completed, cancelled).
// prescription: The ID of the prescription associated with the consultation.
// diagnosis: The diagnosis provided during the consultation.
// followUpDate: The date for a follow-up consultation.
