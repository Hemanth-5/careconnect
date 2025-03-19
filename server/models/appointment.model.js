import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "scheduled",
      "completed",
      "cancelled",
      "no-show",
    ],
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notes: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 30, // Duration in minutes
      min: 5,
      max: 120,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "scheduled",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "pending",
    },
    notes: String,
    reason: String,
    symptoms: [String],
    followUp: Boolean,
    recommendedBy: String,
    statusHistory: [statusHistorySchema],
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "pending"],
      default: "unpaid",
    },
    paymentAmount: {
      type: Number,
    },
    paymentMethod: String,
    paymentId: String,
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });

// Static method to check for time conflicts
appointmentSchema.statics.checkForConflicts = async function (
  doctorId,
  startTime,
  endTime,
  excludeAppointmentId = null
) {
  const filter = {
    doctor: doctorId,
    status: { $nin: ["cancelled", "no-show"] },
    appointmentDate: { $lt: endTime },
    $expr: {
      $gt: [
        { $add: ["$appointmentDate", { $multiply: ["$duration", 60000] }] },
        startTime,
      ],
    },
  };

  if (excludeAppointmentId) {
    filter._id = { $ne: excludeAppointmentId };
  }

  const conflictingAppointments = await this.find(filter);
  return conflictingAppointments;
};

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
