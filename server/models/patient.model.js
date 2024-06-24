import mongoose from "mongoose";

// Model for a patient
const PatientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    bloodPressure: {
      type: String,
      required: true,
    },
    heartRate: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    insurance: {
      provider: String,
      policyNo: String,
      groupNo: String,
    },
    preferredDoctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctors",
    },
    medicalHistory: {
      type: [String],
      default: [],
    },
    // Stored as Appointment model
    appointments: {
      type: [mongoose.Types.ObjectId],
      ref: "Appointments",
      default: [],
    },
    // Stored as Prescription model
    prescriptions: {
      type: [mongoose.Types.ObjectId],
      ref: "Prescriptions",
      default: [],
    },
    // Stored as Lab Tests model
    labTests: {
      type: [mongoose.Types.ObjectId],
      ref: "Lab Tests",
      default: [],
    },
    allergies: [String],
  },
  { timestamps: true }
);

const Patients = mongoose.model("Patients", PatientSchema);
export default Patients;
