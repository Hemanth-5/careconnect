import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  qualifications: [String], // Medical degrees or certifications
  specialization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialization",
  }, // Specialization reference
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "PatientRecord" }], // List of patients
  schedule: [
    {
      day: { type: String },
      time: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
