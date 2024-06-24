import mongoose from "mongoose";

// Model for an appointment
// Mainly used to store the appointment details
const AppointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "Doctors",
    },
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "Patients",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Appointments = mongoose.model("Appointments", AppointmentSchema);

export default Appointments;
