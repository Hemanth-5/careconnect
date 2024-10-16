import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming doctor is also a User
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming patient is also a User
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
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
