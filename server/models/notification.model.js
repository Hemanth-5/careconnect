import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["appointment", "prescription", "message", "report"],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    metadata: {
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
      prescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
      reportId: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalReport" },
    },
    dateSent: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
