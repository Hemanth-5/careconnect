import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    reason: {
      type: String,
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

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;

// Description of the appointment model:
// The appointment model consists of the following fields:
// patientId: The ID of the patient associated with the appointment.
// doctorId: The ID of the doctor associated with the appointment.
// date: The date of the appointment.
// time: The time of the appointment.
// status: The status of the appointment (pending, confirmed, cancelled).
// reason: The reason for the appointment.
// prescription: The ID of the prescription associated with the appointment.
// notes: Additional notes for the appointment.
