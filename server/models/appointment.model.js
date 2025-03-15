import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // Example: "9 AM - 10 AM"
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    reason: { type: String },
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
    notes: {
      doctorNotes: { type: String },
      patientFeedback: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
