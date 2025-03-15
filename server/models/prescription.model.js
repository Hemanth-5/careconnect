import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    instructions: { type: String }, // Example: "Take 2 times a day"
    frequency: { type: String }, // Example: "3 times a day"
    duration: { type: String }, // Example: "7 days"
  },
  { timestamps: true }
);

const prescriptionSchema = new mongoose.Schema(
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
    medications: [medicationSchema],
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "expired", "completed"],
      default: "active",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
