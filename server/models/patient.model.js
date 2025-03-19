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
    // Added name field for compatibility with frontend
    name: { type: String },
    // Changed from array to object for easier access in frontend
    medicalHistory: { type: String },
    allergies: [{ type: String }],
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
    },
    emergencyContacts: [emergencyContactSchema],
    insuranceDetails: {
      provider: { type: String },
      policyNumber: { type: String },
      coverageDetails: { type: String },
    },
    // Added calculatedAge to match frontend
    calculatedAge: { type: Number },
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
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    patientRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PatientRecord",
      },
    ],
    // Added height and weight for more complete medical profile
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    // Added medications and conditions for more detailed medical history
    currentMedications: [{ type: String }],
    chronicConditions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
