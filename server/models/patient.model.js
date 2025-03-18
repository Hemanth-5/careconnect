import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String },
    relationship: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medicalHistory: [{ type: String }],
    allergies: [{ type: String }],
    emergencyContacts: [emergencyContactSchema],
    insuranceDetails: {
      provider: { type: String },
      policyNumber: { type: String },
      coverageDetails: { type: String },
    },
    consultedDoctors: [
      {
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
        appointments: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
