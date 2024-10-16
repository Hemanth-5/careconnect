import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  dosage: String, // Consider regex validation for dosage formats
  sideEffects: [String], // Allow multiple side effects
});

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;
