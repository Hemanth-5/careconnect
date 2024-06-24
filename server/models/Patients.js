import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    userId: String,
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
    preferredDoctor: String,
    medicalHistory: [String],
    appointments: [
      {
        doctorId: String,
        date: Date,
        status: String,
      },
    ],
    prescriptions: [
      {
        doctorId: String,
        medication: String,
        dosage: String,
        instructions: String,
      },
    ],
    labResults: [
      {
        testName: String,
        result: String,
        date: Date,
      },
    ],
    allergies: [String],
  },
  { timestamps: true },
);

const Patients = mongoose.model("Patients", PatientSchema);
export default Patients;
